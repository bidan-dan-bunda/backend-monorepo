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
  thumbnail_url?: string;
  week?: number;
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
    thumbnail_url: DataTypes.STRING,
    week: DataTypes.INTEGER,
  },
  options: {
    timestamps: false,
    tableName: 'videomateri',
  },
};
