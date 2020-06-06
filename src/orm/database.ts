import {
  Sequelize,
  Model,
  BuildOptions,
  ModelOptions,
  ModelAttributes,
  FindOptions,
  CreateOptions,
} from 'sequelize';

import * as models from './models';
import { getConfig } from '../config';

let sequelize: Sequelize | null = null;

const config = getConfig();

const defaultDatabaseConnection = {
  database: config.DB_NAME as string,
  user: config.DB_USER as string,
  password: config.DB_PASS as string,
  host: config.DB_HOST as string,
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
      dialectOptions: {
        connectTimeout: 1800000,
      },
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
  static sequelize = sequelize;

  public model: typeof Model & {
    new (values?: object, options?: BuildOptions): T;
  };

  constructor(model: ModelDefinition, connection = defaultDatabaseConnection) {
    sequelize = getSequelizeInstance(connection);

    if (!sequelize.models[model.name]) {
      Database.initializeModel(connection, model);
    }
    this.model = sequelize?.models[model.name] as any;
  }

  static initializeModels(connection = defaultDatabaseConnection) {
    const sequelize = getSequelizeInstance(connection);
    for (const name in models) {
      const model = (models as { [name: string]: ModelDefinition })[name];
      Database.initializeModel(connection, model);
    }
  }

  static initializeModel(
    connection = defaultDatabaseConnection,
    model: ModelDefinition
  ) {
    sequelize = getSequelizeInstance(connection);
    if (model.run) {
      model.run(sequelize);
    } else {
      sequelize?.define(model.name, model.attributes, model.options) as any;
    }
    model.runAfter && process.nextTick(model.runAfter.bind(model, sequelize));
  }

  async load(options?: FindOptions) {
    return await this.model.findAll(options);
  }

  async create(values?: object, options?: CreateOptions) {
    return await this.model.create(values, options);
  }
}
