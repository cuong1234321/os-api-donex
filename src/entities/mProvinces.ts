import { DataTypes } from 'sequelize';

const MProvinceEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  code: {
    type: DataTypes.STRING(10), allowNull: false,
  },
  title: {
    type: DataTypes.STRING(100), allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default MProvinceEntity;
