import { Model, DataTypes } from 'sequelize';
import { ModelDefinition } from '../database';

export class ChatMember extends Model {
  user_id!: number;
  chatroom_id!: string;
}

export const ChatMemberDefinition: ModelDefinition = {
  name: 'chat_member',
  attributes: {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chatroom_id: {
      type: DataTypes.STRING(21),
      allowNull: false,
      primaryKey: true,
    },
  },
  options: {
    timestamps: false,
  },
  run(sequelize) {
    ChatMember.init(this.attributes, {
      modelName: this.name,
      sequelize,
      ...this.options,
    });
  },
  runAfter() {
    ChatMember.belongsTo(ChatMember, {
      as: 'parent',
      foreignKey: 'chatroom_id',
    });
  },
};
