import { DataTypes } from 'sequelize';

const PermissionEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  groupId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  key: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
};

export default PermissionEntity;
