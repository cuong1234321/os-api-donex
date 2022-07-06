import { DataTypes } from 'sequelize';

const WarehouseReceiptEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  adminId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  type: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  importAbleType: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  importAble: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  importDate: {
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
  discount: {
    type: DataTypes.BIGINT, defaultValue: 0,
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

export default WarehouseReceiptEntity;
