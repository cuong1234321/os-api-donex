import { DataTypes } from 'sequelize';

const MWardEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  districtId: {
    type: DataTypes.INTEGER, allowNull: false,
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
  ghnWardCode: {
    type: DataTypes.STRING(30), allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default MWardEntity;
