import { Model } from 'sequelize';

export interface VideoFields {
  id: number;
  title: string;
  url: string;
  thumbnail?: Buffer;
  week: number;
}

export class Video extends Model {}
