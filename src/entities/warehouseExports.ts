import { DataTypes } from 'sequelize';

const WarehouseExportEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  adminId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  type: {
    type: DataTypes.ENUM({ values: ['sell', 'others'] }), defaultValue: 'sell',
  },
  exportAbleType: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  exportAble: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  exportDate: {
    type: DataTypes.DATE, allowNull: true,
  },
  orderId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  deliverer: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  note: {
    type: DataTypes.TEXT, allowNull: true,
  },
  status: {
    type: DataTypes.ENUM({ values: ['pending', 'waitingToTransfer', 'complete', 'cancel'] }),
    defaultValue: 'pending',
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

export default WarehouseExportEntity;
