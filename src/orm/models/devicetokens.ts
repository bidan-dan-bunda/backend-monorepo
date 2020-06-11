import { Model, DataTypes } from 'sequelize';
import { ModelDefinition } from '../database';

export interface DeviceTokenFields {
  id: number;
  token: string;
  user_id?: number;
}

export interface DeviceToken extends Model, DeviceTokenFields {}

export const DeviceTokenDefinition: ModelDefinition = {
  name: 'fb_device_tokens',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
  },
  options: {
    timestamps: false,
  },
};
