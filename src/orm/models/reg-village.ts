import { DataTypes } from 'sequelize';
import { Model, BuildOptions } from 'sequelize';

export interface VillageModel extends Model {
  id: string;
  name: string;
}

export type VillageModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): VillageModel;
};

const VillageModel = {
  name: 'reg_village',
  attributes: {
    id: {
      primaryKey: true,
      type: DataTypes.CHAR(10),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    district_id: {
      type: DataTypes.CHAR(7),
    },
  },
  options: {
    timestamps: false,
  },
};

export default VillageModel;
