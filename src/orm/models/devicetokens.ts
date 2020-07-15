import { User } from './user';
import { Model, DataTypes } from 'sequelize';
import { ModelDefinition } from '../database';

export class DeviceToken extends Model {
  id!: number;
  token!: string;
  user_id!: number;
}

export const DeviceTokenDefinition: ModelDefinition = {
  name: 'fb_device_tokens',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
  },
  options: {
    timestamps: false,
  },
  run(sequelize) {
    DeviceToken.init(this.attributes, {
      ...this.options,
      sequelize,
      modelName: this.name,
    });
  },
  runAfter() {
    DeviceToken.belongsTo(User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  },
};
