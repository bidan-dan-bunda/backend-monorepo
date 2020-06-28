import { User } from './user';
import { Model, DataTypes } from 'sequelize';
import { ModelDefinition } from '../database';

export class Patient extends Model {
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
    patient_note: DataTypes.STRING(512),
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
    });
  },
};
