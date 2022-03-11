import { DataTypes } from 'sequelize';

const MSizeEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  type: {
    type: DataTypes.ENUM({ values: ['children', 'clothes', 'shoes'] }),
  },
  code: {
    type: DataTypes.STRING(10), allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default MSizeEntity;
