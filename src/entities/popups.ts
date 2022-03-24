import settings from '@configs/settings';
import { DataTypes } from 'sequelize';

const PopupEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
    get (): string {
      const image = this.getDataValue('image') !== null
        ? `${settings.imageStorageHost}/${this.getDataValue('image')}`
        : null;
      return image;
    },
  },
  title: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  link: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  frequency: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  applyAt: {
    type: DataTypes.DATE, allowNull: true,
  },
  applyTo: {
    type: DataTypes.DATE, allowNull: true,
  },
  status: {
    type: DataTypes.ENUM({ values: ['active', 'inactive'] }), defaultValue: 'inactive',
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default PopupEntity;
