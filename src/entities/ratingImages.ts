import settings from '@configs/settings';
import { DataTypes } from 'sequelize';

const RatingImageEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  ratingAbleId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true,
    get (): string {
      const image = this.getDataValue('image') !== null
        ? `${settings.imageStorageHost}/${this.getDataValue('image')}`
        : null;
      return image;
    },
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default RatingImageEntity;
