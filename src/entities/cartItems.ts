import { DataTypes } from 'sequelize';

const CartItemEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  cartId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  productVariantId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  warehouseId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default CartItemEntity;
