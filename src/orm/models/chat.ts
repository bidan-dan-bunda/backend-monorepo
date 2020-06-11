import { ModelDefinition } from './../database';
import { Model, DataTypes } from 'sequelize';

export interface ChatFields {
  sender_id: number;
  target_id: number;
  message: string;
  timestamp: Date;
  is_sent: boolean;
}

export interface Chat extends Model {}

export const ChatDefinition: ModelDefinition = {
  name: 'chat',
  attributes: {
    sender_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    target_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_sent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  options: {
    createdAt: 'timestamp',
    updatedAt: false,
  },
};
