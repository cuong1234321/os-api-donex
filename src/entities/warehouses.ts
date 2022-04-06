import { DataTypes } from 'sequelize';

const WarehouseEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  type: {
    type: DataTypes.ENUM({ values: ['storage', 'sell'] }),
    defaultValue: 'storage',
  },
  description: {
    type: DataTypes.TEXT, allowNull: true,
  },
  status: {
    type: DataTypes.ENUM({ values: ['active', 'inactive'] }),
    defaultValue: 'inactive',
  },
  code: {
    type: DataTypes.STRING(255), allowNull: true,
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

export default WarehouseEntity;
