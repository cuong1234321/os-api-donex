import { DataTypes } from 'sequelize';

const ProductVariantOptionEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  variantId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  optionId: {
    type: DataTypes.INTEGER, allowNull: false,
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

export default ProductVariantOptionEntity;
