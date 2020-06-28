import { User } from './user';
import { Video } from './video';
import {
  Model,
  HasManyGetAssociationsMixin,
  Association,
  DataTypes,
  Sequelize,
} from 'sequelize';
import { ModelDefinition } from '../database';

export class VideoMateri extends Model {
  id!: number;
  content!: string;
  thumbnail_url?: string;
  week?: number;
  author_id!: number;
}

export const VideoMateriDefinition: ModelDefinition = {
  name: 'VideoMateri',
  attributes: {
    week: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    content: DataTypes.STRING,
    thumbnail_url: DataTypes.STRING,
    author_id: DataTypes.INTEGER,
  },
  options: {
    timestamps: false,
    tableName: 'videomateri',
  },
  run(sequelize) {
    VideoMateri.init(this.attributes, {
      modelName: this.name,
      sequelize,
      ...this.options,
    });
  },
  runAfter() {
    VideoMateri.hasMany(Video, {
      foreignKey: 'week',
      as: 'videos',
    });
    VideoMateri.belongsTo(User, {
      foreignKey: 'author_id',
      as: 'author',
    });
  },
};
