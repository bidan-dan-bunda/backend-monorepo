import { User } from './user';
import { ModelDefinition } from './../database';
import sequelize, {
  Model,
  DataTypes,
  BelongsToGetAssociationMixin,
  Association,
} from 'sequelize';

export interface ChatGroupFields {
  sender_id: number;
  pus_id: number;
  message: string;
  timestamp: Date;
}

export class ChatGroup extends Model implements ChatGroupFields {
  sender_id!: number;
  pus_id!: number;
  message!: string;
  timestamp!: Date;

  getSender!: BelongsToGetAssociationMixin<User>;

  public static associations: {
    sender: Association<ChatGroup, User>;
  };
}

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
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: sequelize.literal('UNIX_TIMESTAMP()'),
    },
  },
  options: {
    createdAt: 'timestamp',
    updatedAt: false,
  },

  run(sequelize) {
    ChatGroup.init(this.attributes, {
      modelName: this.name,
      sequelize,
      ...this.options,
    });
  },

  runAfter() {
    ChatGroup.belongsTo(User, {
      foreignKey: 'sender_id',
      as: 'sender',
    });
  },
};
