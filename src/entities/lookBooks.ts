import settings from '@configs/settings';
import { DataTypes } from 'sequelize';
const LookBookEntity = {
  id: {
    type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  description: {
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
  slug: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  status: {
    type: DataTypes.ENUM({ values: ['active', 'inactive'] }), defaultValue: 'active',
  },
  parentId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default LookBookEntity;
