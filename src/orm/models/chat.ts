import { ModelDefinition } from './../database';
import { Model, DataTypes } from 'sequelize';
import sequelize from 'sequelize';

export interface ChatFields {
  id: number;
  chatroom_id: string;
  message: string;
  timestamp: Date;
  is_sent: boolean;
}

export interface Chat extends Model {}

export const ChatDefinition: ModelDefinition = {
  name: 'chat',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    chatroom_id: {
      type: DataTypes.STRING(21),
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    target_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: sequelize.literal('UNIX_TIMESTAMP()'),
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
