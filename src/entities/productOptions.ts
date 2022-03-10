import settings from '@configs/settings';
import { DataTypes } from 'sequelize';

const ProductOptionEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  key: {
    type: DataTypes.ENUM({ values: ['size', 'color', 'form'] }),
    defaultValue: 'size',
  },
  value: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  thumbnail: {
    type: DataTypes.TEXT,
    allowNull: true,
    get (): string {
      const thumbnail = this.getDataValue('thumbnail') !== null
        ? `${settings.imageStorageHost}/${this.getDataValue('thumbnail')}`
        : null;
      return thumbnail;
    },
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

export default ProductOptionEntity;
