import { User } from './user';
import { ModelDefinition } from './../database';
import { Model, DataTypes } from 'sequelize';

export class JadwalDiskusi extends Model {
  id!: number;
  bid_id!: number;
  title!: string;
  timestamp!: number;
  reminder_timestamp?: number;
  job_id!: string;
  reminder_job_id?: string;
}

export const JadwalDiskusiDefinition: ModelDefinition = {
  name: 'jadwal_diskusi',
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    bid_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: DataTypes.BIGINT,
    reminder_timestamp: DataTypes.BIGINT,
    job_id: DataTypes.STRING,
    reminder_job_id: DataTypes.STRING,
  },
  options: {
    freezeTableName: true,
    timestamps: false,
  },
  run(sequelize) {
    JadwalDiskusi.init(this.attributes, {
      ...this.options,
      sequelize,
      modelName: this.name,
    });
  },
  runAfter() {
    JadwalDiskusi.belongsTo(User, {
      foreignKey: 'bid_id',
      as: 'bidan',
    });
  },
};
