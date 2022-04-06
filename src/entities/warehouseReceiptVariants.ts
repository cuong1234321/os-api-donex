import { DataTypes } from 'sequelize';

const WarehouseReceiptVariantEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  warehouseReceiptId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  variantId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  warehouseId: {
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

export default WarehouseReceiptVariantEntity;
