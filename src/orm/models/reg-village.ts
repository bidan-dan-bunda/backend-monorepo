import { ModelDefinition } from './../database';
import { Model, DataTypes, Sequelize } from 'sequelize';

export interface VillageFields {
  id: string;
  name: string;
  district_id: string;
}

export class Village extends Model implements VillageFields {
  public id!: string;
  public name!: string;
  public district_id!: string;
}

export const VillageDefinition: ModelDefinition = {
  name: 'Village',
  attributes: {
    id: {
      type: DataTypes.CHAR(10),
      primaryKey: true,
    },
    name: DataTypes.STRING,
  },
  options: {
    timestamps: false,
    tableName: 'reg_villages',
  },
  run(sequelize: Sequelize) {
    Village.init(this.attributes, {
      modelName: this.name,
      sequelize,
      ...this.options,
    });
  },
};
