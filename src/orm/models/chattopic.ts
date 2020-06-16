import { Model, DataTypes } from 'sequelize';
import { ModelDefinition } from '../database';

export interface ChatTopicFields {
  topic: string;
  pus_id: number;
}

export interface ChatTopic extends Model, ChatTopicFields {}

export const ChatTopicDefinition: ModelDefinition = {
  name: 'chat_topics',
  attributes: {
    topic: {
      type: DataTypes.STRING(15),
      allowNull: false,
      primaryKey: true,
    },
    pus_id: {
      type: DataTypes.INTEGER,
    },
  },
  options: {
    timestamps: false,
  },
};
