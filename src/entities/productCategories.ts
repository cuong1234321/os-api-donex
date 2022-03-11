import settings from '@configs/settings';
import { DataTypes } from 'sequelize';

const ProductCategoryEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  parentId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: { msg: 'Tên danh mục không được bỏ trống.' },
      notEmpty: { msg: 'Tên danh mục không được bỏ trống.' },
    },
  },
  slug: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  thumbnail: {
    type: DataTypes.STRING(255),
    allowNull: true,
    get (): string {
      const thumbnail = this.getDataValue('thumbnail') !== null
        ? `${settings.imageStorageHost}/${this.getDataValue('thumbnail')}`
        : null;
      return thumbnail;
    },
  },
  type: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default ProductCategoryEntity;
