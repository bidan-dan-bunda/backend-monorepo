import { ModelDefinition } from './../database';
import { Model, DataTypes } from 'sequelize';

export interface ChatGroupFields {
  sender_id: number;
  pus_id: number;
  message: string;
  timestamp: Date;
}

export interface ChatGroup extends Model {}

export const ChatGroupDefinition: ModelDefinition = {
  name: 'chatgroup',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
    },
    pus_id: {
      type: DataTypes.INTEGER,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  options: {
    createdAt: 'timestamp',
    updatedAt: false,
  },
};
