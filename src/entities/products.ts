import settings from '@configs/settings';
import { DataTypes } from 'sequelize';

const ProductEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: { msg: 'Tên nhóm sản phẩm không được bỏ trống.' },
      notEmpty: { msg: 'Tên nhóm sản phẩm không được bỏ trống.' },
    },
  },
  slug: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    get (): string {
      const avatar = this.getDataValue('avatar') !== null
        ? `${settings.imageStorageHost}/${this.getDataValue('avatar')}`
        : null;
      return avatar;
    },
  },
  description: {
    type: DataTypes.TEXT, allowNull: true,
  },
  shortDescription: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  sizeGuide: {
    type: DataTypes.TEXT, allowNull: true,
  },
  gender: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  typeProductId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  status: {
    type: DataTypes.ENUM({ values: ['draft', 'active', 'inactive'] }),
    defaultValue: 'draft',
  },
  isHighlight: {
    type: DataTypes.BOOLEAN, defaultValue: false,
  },
  isNew: {
    type: DataTypes.BOOLEAN, defaultValue: false,
  },
  inFlashSale: {
    type: DataTypes.BOOLEAN, defaultValue: false,
  },
  weight: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'Cân nặng không được bỏ trống.' },
    },
  },
  length: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  unit: {
    type: DataTypes.STRING(50),
  },
  minStock: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  maxStock: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  skuCode: {
    type: DataTypes.STRING(50), allowNull: true,
  },
  barCode: {
    type: DataTypes.STRING(50), allowNull: true,
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

export default ProductEntity;
