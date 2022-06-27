import { DataTypes } from 'sequelize';

const ProductVerifyCodeEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  skuCode: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  verifyCode: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  appliedAt: {
    type: DataTypes.DATE, allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default ProductVerifyCodeEntity;
