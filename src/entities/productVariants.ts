import { DataTypes } from 'sequelize';

const ProductVariantEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  slug: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  skuCode: {
    type: DataTypes.STRING(50), allowNull: true,
  },
  barCode: {
    type: DataTypes.STRING(50), allowNull: true,
  },
  buyPrice: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  sellPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'Giá bán không được bỏ trống.' },
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  optionMappingIds: {
    type: DataTypes.VIRTUAL,
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

export default ProductVariantEntity;
