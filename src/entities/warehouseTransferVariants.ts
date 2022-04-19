import { DataTypes } from 'sequelize';

const WarehouseTransferVariantEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  warehouseTransferId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  variantId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  price: {
    type: DataTypes.BIGINT, allowNull: true,
  },
  totalPrice: {
    type: DataTypes.BIGINT, allowNull: true,
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

export default WarehouseTransferVariantEntity;