import { ModelDefinition } from './../database';
import {
  Model,
  HasManyGetAssociationsMixin,
  Association,
  DataTypes,
  Sequelize,
} from 'sequelize';
import { Village } from './reg-village';

export interface DistrictFields {
  id: string;
  name: string;
  regency_id: string;
}

export class District extends Model implements DistrictFields {
  public id!: string;
  public name!: string;
  public regency_id!: string;

  public getVillages!: HasManyGetAssociationsMixin<Village>;

  public static associations: {
    villages: Association<District, Village>;
  };
}

export const DistrictDefinition: ModelDefinition = {
  name: 'District',
  attributes: {
    id: {
      type: DataTypes.CHAR(7),
      primaryKey: true,
    },
    name: DataTypes.STRING,
    regency_id: DataTypes.CHAR(4),
  },
  options: {
    timestamps: false,
    tableName: 'reg_districts',
  },
  run(sequelize: Sequelize) {
    District.init(this.attributes, {
      modelName: this.name,
      sequelize,
      ...this.options,
    });
  },
  runAfter(sequelize: Sequelize) {
    District.hasMany(Village, {
      sourceKey: 'id',
      foreignKey: 'district_id',
      as: 'villages',
    });
  },
};
