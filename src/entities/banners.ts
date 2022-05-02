import settings from '@configs/settings';
import { DataTypes } from 'sequelize';

const BannerEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  linkDirect: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  position: {
    type: DataTypes.ENUM({ values: ['top', 'right', 'newProductSlide', 'newProductBanner', 'flashSale', 'highlight', 'productList', 'productDetail', 'show'] }),
    defaultValue: 'top',
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false,
    get (): string {
      const image = this.getDataValue('image') !== null
        ? `${settings.imageStorageHost}/${this.getDataValue('image')}`
        : null;
      return image;
    },
    set (value: string) {
      if (!value) return;
      if (value.includes(settings.imageStorageHost)) {
        const image = value.slice(settings.imageStorageHost.length + 1);
        this.setDataValue('image', image);
      } else {
        this.setDataValue('image', value);
      }
    },
  },
  orderId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  isHighLight: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  type: {
    type: DataTypes.ENUM({ values: ['homepage', 'product', 'profile', 'news', 'carts'] }),
    defaultValue: 'homepage',
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

export default BannerEntity;
