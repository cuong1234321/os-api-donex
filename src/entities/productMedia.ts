import settings from '@configs/settings';
import { DataTypes } from 'sequelize';

const ProductMediaEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  source: {
    type: DataTypes.TEXT,
    allowNull: true,
    get (): string {
      if (!this.getDataValue('source')) return;
      const source = this.getDataValue('type') === 'video'
        ? `${settings.videoStorageHost}/${this.getDataValue('source')}`
        : `${settings.imageStorageHost}/${this.getDataValue('source')}`;
      return source;
    },
  },
  type: {
    type: DataTypes.ENUM({ values: ['image, video'] }),
    defaultValue: 'image',
  },
  isThumbnail: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default ProductMediaEntity;
