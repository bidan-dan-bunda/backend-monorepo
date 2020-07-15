import { User } from './user';
import { ModelDefinition } from './../database';
import { Model, DataTypes } from 'sequelize';

export class Notification extends Model {
  id!: number;
  sender_id?: number;
  receipt_id!: string;
  activity_type?: number;
  object_type?: string;
  object_url?: string;
  is_read!: boolean;
  timestamp!: bigint;
}

export const NotificationDefinition: ModelDefinition = {
  name: 'notifications',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
    },
    receipt_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activity_type: DataTypes.STRING,
    object_type: DataTypes.STRING,
    object_url: DataTypes.STRING,
    is_read: DataTypes.BOOLEAN,
    timestamp: DataTypes.BIGINT,
  },
  options: {
    freezeTableName: true,
    createdAt: 'timestamp',
    updatedAt: false,
  },
  run(sequelize) {
    Notification.init(this.attributes, {
      ...this.options,
      sequelize,
      modelName: this.name,
    });
  },
  runAfter() {},
};
