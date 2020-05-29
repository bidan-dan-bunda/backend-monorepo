import { ModelDefinition } from './../database';
import { DataTypes } from 'sequelize';
import { Model, BuildOptions } from 'sequelize';

export interface UserFields {
  id: number;
  user_type: string;
  username: string;
  password: string;
  name: string;
  full_address?: string;
  address_province?: string;
  address_regency?: string;
  address_district?: string;
  address_village?: string;
  telephone?: string;
  profile_img?: Buffer;
}

export interface User extends UserFields, Model {}

export const UserDefinition: ModelDefinition = {
  name: 'user',
  attributes: {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    user_type: {
      type: DataTypes.ENUM('b', 'u'),
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    full_address: {
      type: DataTypes.STRING,
    },
    address_province: {
      type: DataTypes.CHAR(2),
    },
    address_regency: {
      type: DataTypes.CHAR(4),
    },
    address_district: {
      type: DataTypes.CHAR(7),
    },
    address_village: {
      type: DataTypes.CHAR(10),
    },
    telephone: {
      type: DataTypes.STRING,
    },
    profile_img: {
      type: DataTypes.BLOB,
    },
    pus_id: {
      type: DataTypes.INTEGER,
    },
  },
  options: {
    timestamps: false,
  },
};
