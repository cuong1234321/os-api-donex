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
  misaCode: {
    type: DataTypes.STRING(30), allowNull: false,
  },
  ghnProvinceId: {
    type: DataTypes.STRING(30), allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default MProvinceEntity;
