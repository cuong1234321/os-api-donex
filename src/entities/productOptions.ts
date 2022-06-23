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
    type: DataTypes.ENUM({ values: ['size', 'color', 'form', 'supportingColor'] }),
    defaultValue: 'size',
  },
  value: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  thumbnail: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get (): (string)[] {
      const thumbnails = this.getDataValue('thumbnail') ? JSON.parse(this.getDataValue('thumbnail')) : [];
      if (!thumbnails || thumbnails.length === 0) return [];
      return thumbnails.map((record: any) => {
        return {
          source: record.type === 'image' ? `${settings.imageStorageHost}/${record.source}` : `${settings.videoStorageHost}/${record.source}`,
          type: record.type,
        };
      });
    },
    set (value: (any)[]) {
      if (!value) { return this.setDataValue('thumbnail', []); };
      value = value.map((record: any) => {
        return {
          source: record.type === 'image' ? record.source.replace(settings.imageStorageHost + '/', '') : record.source.replace(settings.videoStorageHost + '/', ''),
          type: record.type,
        };
      });
      const thumbnails = JSON.stringify(value);
      this.setDataValue('thumbnail', thumbnails);
    },
  },
  optionMappingId: {
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

export default ProductOptionEntity;
