import { DataTypes } from 'sequelize';

const MColorEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  title: {
    type: DataTypes.STRING(50), allowNull: false,
  },
  colorCode: {
    type: DataTypes.STRING(10), allowNull: false,
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

export default MColorEntity;
