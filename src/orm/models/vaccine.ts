import { ModelDefinition } from './../database';
import { Model, DataTypes } from 'sequelize';

export interface VaccineFields {
  id: number;
  name: string;
  pus_id: number;
  description?: string;
  thumbnail_url?: string;
  in_stock?: boolean;
  stock?: number;
}

export interface Vaccine extends Model, VaccineFields {}

export const VaccineDefinition: ModelDefinition = {
  name: 'vaccine',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING,
    thumbnail_url: DataTypes.STRING,
    in_stock: DataTypes.BOOLEAN,
    pus_id: DataTypes.INTEGER,
  },
  options: {
    underscored: true,
  },
};
