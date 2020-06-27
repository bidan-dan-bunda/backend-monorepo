import { ModelDefinition } from './../database';
import { Model, DataTypes } from 'sequelize';

export class Video extends Model {
  id!: number;
  title!: string;
  url?: string;
  thumbnail_url?: string;
  week?: number;
  video_duration?: number;
}

export const VideoDefinition: ModelDefinition = {
  name: 'video',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    week: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: DataTypes.STRING,
    url: DataTypes.STRING,
    thumbnail_url: DataTypes.STRING,
    author_id: DataTypes.INTEGER,
    video_duration: DataTypes.INTEGER,
  },
  options: {
    timestamps: false,
  },
  run(sequelize) {
    Video.init(this.attributes, {
      modelName: this.name,
      sequelize,
      ...this.options,
    });
  },
};
