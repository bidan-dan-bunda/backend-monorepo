import { ModelDefinition } from './../database';
import {
  Model,
  HasManyGetAssociationsMixin,
  Association,
  DataTypes,
  Sequelize,
} from 'sequelize';
import { District } from './reg-district';

export interface RegencyFields {
  id: string;
  name: string;
  province_id: string;
}

export class Regency extends Model implements RegencyFields {
  public id!: string;
  public name!: string;
  public province_id!: string;

  public getDistricts!: HasManyGetAssociationsMixin<District>;

  public static associations: {
    districts: Association<Regency, District>;
  };
}

export const RegencyDefinition: ModelDefinition = {
  name: 'Regency',
  attributes: {
    id: {
      type: DataTypes.CHAR(4),
      primaryKey: true,
    },
    name: DataTypes.STRING,
    province_id: DataTypes.CHAR(4),
  },
  options: {
    timestamps: false,
    tableName: 'reg_regencies',
  },
  run(sequelize: Sequelize) {
    Regency.init(this.attributes, {
      modelName: this.name,
      sequelize,
      ...this.options,
    });
  },
  runAfter(sequelize: Sequelize) {
    Regency.hasMany(District, {
      sourceKey: 'id',
      foreignKey: 'regency_id',
      as: 'districts',
    });
  },
};
