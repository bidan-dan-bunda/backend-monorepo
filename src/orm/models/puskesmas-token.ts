import { Puskesmas } from './puskesmas';
import {
  Model,
  DataTypes,
  Sequelize,
  BelongsToGetAssociationMixin,
  Association,
} from 'sequelize';
import { ModelDefinition } from '../database';

export interface PuskesmasTokenFields {
  token: string;
  pus_id: string;
}

export class PuskesmasToken extends Model implements PuskesmasTokenFields {
  token!: string;
  pus_id!: string;

  getPuskesmas!: BelongsToGetAssociationMixin<Puskesmas>;

  public static associations: {
    puskesmas: Association<PuskesmasToken, Puskesmas>;
  };
}

export const PuskesmasTokenDefinition: ModelDefinition = {
  name: 'puskesmas_tokens',
  attributes: {
    token: {
      type: DataTypes.STRING(7),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    pus_id: {
      type: DataTypes.INTEGER,
    },
  },
  options: {
    createdAt: 'created_at',
    updatedAt: false,
    freezeTableName: true,
  },
  run(sequelize) {
    PuskesmasToken.init(this.attributes, {
      modelName: this.name,
      sequelize,
      ...this.options,
    });
  },
  runAfter() {
    PuskesmasToken.belongsTo(Puskesmas, {
      foreignKey: 'pus_id',
      as: 'puskesmas',
    });
  },
};
