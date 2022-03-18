import { DataTypes } from 'sequelize';

const MUserTypeEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100), allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default MUserTypeEntity;
