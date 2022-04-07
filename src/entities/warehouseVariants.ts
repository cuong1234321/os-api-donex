import { DataTypes } from 'sequelize';

const WarehouseVariantEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  warehouseId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  variantId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default WarehouseVariantEntity;
