import { DataTypes } from 'sequelize';
import { Model, BuildOptions } from 'sequelize';

export interface RegencyModel extends Model {
  id: string;
  name: string;
}

export type RegencyModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): RegencyModel;
};

const RegencyModel = {
  name: 'reg_regency',
  attributes: {
    id: {
      primaryKey: true,
      type: DataTypes.CHAR(4),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    province_id: {
      type: DataTypes.CHAR(2),
    },
  },
  options: {
    timestamps: false,
  },
};

export default RegencyModel;
