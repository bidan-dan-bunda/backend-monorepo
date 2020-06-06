import { ModelDefinition } from './../database';
import { Model, DataTypes } from 'sequelize';

export interface VideoFields {
  id: number;
  title: string;
  url?: string;
  thumbnail_url?: string;
  week?: number;
}

export interface Video extends Model, VideoFields {}

export const VideoDefinition: ModelDefinition = {
  name: 'video',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    title: DataTypes.STRING,
    url: DataTypes.STRING,
    thumbnail_url: DataTypes.STRING,
    week: DataTypes.INTEGER,
  },
  options: {
    timestamps: false,
  },
};
