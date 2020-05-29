import { ModelDefinition } from './../database';
import {
  Sequelize,
  Model,
  HasManyGetAssociationsMixin,
  Association,
  DataTypes,
} from 'sequelize';
import { Regency } from './reg-regency';

export interface ProvinceFields {
  id: string;
  name: string;
}

export class Province extends Model implements ProvinceFields {
  public id!: string;
  public name!: string;

  public getRegencies!: HasManyGetAssociationsMixin<Regency>;

  public static associations: {
    regencies: Association<Province, Regency>;
  };
}

export const ProvinceDefinition: ModelDefinition = {
  name: 'Province',
  attributes: {
    id: {
      type: DataTypes.CHAR(2),
      primaryKey: true,
    },
    name: DataTypes.STRING,
  },
  options: {
    timestamps: false,
    tableName: 'reg_provinces',
  },
  run(sequelize: Sequelize) {
    Province.init(this.attributes, {
      modelName: this.name,
      sequelize,
      ...this.options,
    });
  },
  runAfter(sequelize: Sequelize) {
    Province.hasMany(Regency, {
      sourceKey: 'id',
      foreignKey: 'province_id',
      as: 'regencies',
    });
  },
};
