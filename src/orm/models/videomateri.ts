import { Video } from './video';
import {
  Model,
  HasManyGetAssociationsMixin,
  Association,
  DataTypes,
  Sequelize,
} from 'sequelize';
import { ModelDefinition } from '../database';

export interface VideoMateriFields {
  id: number;
  content: string;
  thumbnail?: Buffer;
  week?: number;
  user_bid_id: number;
  video_id?: number;
}

export interface VideoMateri extends Model, VideoMateriFields {}

export const VideoMateriDefinition: ModelDefinition = {
  name: 'VideoMateri',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: DataTypes.STRING,
    thumbnail: DataTypes.BLOB,
    week: DataTypes.INTEGER,
    user_bid_id: DataTypes.INTEGER,
    video_id: DataTypes.INTEGER,
  },
  options: {
    timestamps: false,
    tableName: 'videomateri',
  },
};
