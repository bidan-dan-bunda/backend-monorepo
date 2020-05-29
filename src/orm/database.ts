import {
  Sequelize,
  Model,
  BuildOptions,
  ModelOptions,
  ModelAttributes,
} from 'sequelize';

import * as models from './models';

let sequelize: Sequelize | null = null;

const defaultDatabaseConnection = {
  database: process.env.DB_NAME as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  host: process.env.DB_HOST as string,
};

export function getSequelizeInstance({
  database,
  user,
  password,
  host,
} = defaultDatabaseConnection) {
  if (!sequelize) {
    sequelize = new Sequelize(database, user, password, {
      host,
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 1000,
      },
    });
  }
  return sequelize;
}

export interface ModelDefinition {
  name: string;
  attributes: ModelAttributes;
  options?: ModelOptions;
  run?: {
    (s: Sequelize): void;
  };
  runAfter?: {
    (s: Sequelize): void;
  };
}

export default class Database<T extends Model> {
  public sequelize: Sequelize;
  public model: typeof Model & {
    new (values?: object, options?: BuildOptions): T;
  };

  constructor(model: ModelDefinition, connection = defaultDatabaseConnection) {
    this.sequelize = getSequelizeInstance(connection);

    if (!this.sequelize.models[model.name]) {
      if (model.run) {
        model.run(this.sequelize);
      } else {
        sequelize?.define(model.name, model.attributes, model.options) as any;
      }
      model.runAfter && process.nextTick(model.runAfter.bind(model));
    }
    this.model = sequelize?.models[model.name] as any;
  }

  static initializeModels(connection = defaultDatabaseConnection) {
    const sequelize = getSequelizeInstance(connection);
    for (const name in models) {
      const model = (models as { [name: string]: ModelDefinition })[name];
      if (model.run) {
        model.run(sequelize);
      } else {
        sequelize?.define(model.name, model.attributes, model.options) as any;
      }
      model.runAfter && process.nextTick(model.runAfter.bind(model, sequelize));
    }
  }

  async load(options?: any) {
    return (await this.model.findAll(options)).map(
      (values) => (values as any).dataValues
    );
  }
}
