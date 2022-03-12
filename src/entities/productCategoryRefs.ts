import { DataTypes } from 'sequelize';

const ProductCategoryRefEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  productCategoryId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default ProductCategoryRefEntity;
