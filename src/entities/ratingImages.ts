import settings from '@configs/settings';
import { DataTypes } from 'sequelize';

const RatingImageEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  ratingAbleId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  source: {
    type: DataTypes.STRING(255),
    allowNull: true,
    get (): string {
      let source: any;
      if (this.getDataValue('source') === null) { source = null; return source; }
      if (this.getDataValue('type') === 'image') {
        source = `${settings.imageStorageHost}/${this.getDataValue('source')}`;
      } else if (this.getDataValue('type') === 'video') {
        source = `${settings.videoStorageHost}/${this.getDataValue('source')}`;
      }
      return source;
    },
  },
  type: {
    type: DataTypes.ENUM({ values: ['image', 'video'] }),
    defaultValue: 'image',
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default RatingImageEntity;
