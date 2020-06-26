import { User } from './user';
import { Model, DataTypes } from 'sequelize';
import { ModelDefinition } from '../database';

export interface PatientFields {
  user_id: number;
  patient_note: string;
  medical_record_id: number;
}

export class Patient extends Model implements PatientFields {
  user_id!: number;
  patient_note!: string;
  medical_record_id!: number;
}

export const PatientDefinition: ModelDefinition = {
  name: 'patient',
  attributes: {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_note: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    medical_record_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  options: {
    timestamps: false,
  },
  run(sequelize) {
    Patient.init(this.attributes, {
      modelName: this.name,
      sequelize,
      ...this.options,
    });
  },
  runAfter() {
    Patient.belongsTo(User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  },
};
