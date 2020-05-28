import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';

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

export default class Database<T extends Model> {
  public sequelize: Sequelize;
  public model: typeof Model & {
    new (values?: object, options?: BuildOptions): T;
  };

  constructor(
    model: {
      name: string;
      attributes: any;
      options?: any;
    },
    connection = defaultDatabaseConnection
  ) {
    this.sequelize = getSequelizeInstance(connection);

    this.model = <any>(
      (sequelize as Sequelize).define(
        model.name,
        model.attributes,
        model.options
      )
    );
  }

  async load(options?: any) {
    return (await this.model.findAll(options)).map(
      (values) => (values as any).dataValues
    );
  }
}
