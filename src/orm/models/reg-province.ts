import { DataTypes } from 'sequelize';
import { Model, BuildOptions } from 'sequelize';

export interface ProvinceModel extends Model {
  id: string;
  name: string;
}

export type ProvinceModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ProvinceModel;
};

const ProvinceModel = {
  name: 'reg_province',
  attributes: {
    id: {
      primaryKey: true,
      type: DataTypes.CHAR(2),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  options: {
    timestamps: false,
  },
};

export default ProvinceModel;
