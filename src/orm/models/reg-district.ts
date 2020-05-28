import { DataTypes } from 'sequelize';
import { Model, BuildOptions } from 'sequelize';

export interface DistrictModel extends Model {
  id: string;
  name: string;
}

export type DistrictModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): DistrictModel;
};

const DistrictModel = {
  name: 'reg_district',
  attributes: {
    id: {
      primaryKey: true,
      type: DataTypes.CHAR(7),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    regency_id: {
      type: DataTypes.CHAR(4),
    },
  },
  options: {
    timestamps: false,
  },
};

export default DistrictModel;
