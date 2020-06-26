import { Model, DataTypes } from 'sequelize';
import { ModelDefinition } from '../database';

export interface ChatRoomFields {
  id: string;
}

export interface ChatRoom extends Model, ChatRoomFields {}

export const ChatRoomDefinition: ModelDefinition = {
  name: 'chat_room',
  attributes: {
    id: {
      type: DataTypes.STRING(21),
      allowNull: false,
      primaryKey: true,
    },
  },
  options: {
    timestamps: false,
  },
};
