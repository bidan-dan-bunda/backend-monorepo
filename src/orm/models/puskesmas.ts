import { User } from './user';
import { PuskesmasToken } from './puskesmas-token';
import { Province } from './reg-province';
import { Model, DataTypes } from 'sequelize';
import { ModelDefinition } from '../database';
import { Regency } from './reg-regency';
import { District } from './reg-district';

export interface PuskesmasFields {
  id: number;
  name: string;
  full_address?: string;
  address_province?: string;
  address_regency?: string;
  address_district?: string;
  profile_image?: string;
}

export class Puskesmas extends Model implements PuskesmasFields {
  id!: number;
  name!: string;
  full_address?: string;
  address_province?: string;
  address_regency?: string;
  address_district?: string;
  profile_image?: string;
}

export const PuskesmasDefinition: ModelDefinition = {
  name: 'puskesmas',

  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    full_address: DataTypes.STRING,
    address_province: {
      type: DataTypes.CHAR(2),
      references: {
        model: Province,
      },
    },
    address_regency: {
      type: DataTypes.CHAR(4),
      references: {
        model: Regency,
      },
    },
    address_district: {
      type: DataTypes.CHAR(7),
      references: {
        model: District,
      },
    },
    profile_image: DataTypes.STRING,
  },

  options: {
    tableName: 'puskesmas',
    timestamps: false,
  },

  run(sequelize) {
    Puskesmas.init(this.attributes, {
      modelName: this.name,
      sequelize,
      ...this.options,
    });
  },

  runAfter(sequelize) {
    Puskesmas.hasMany(User, {
      foreignKey: 'pus_id',
      sourceKey: 'id',
      as: 'bunda',
    });
  },
};
