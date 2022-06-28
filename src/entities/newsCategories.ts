import settings from '@configs/settings';
import { DataTypes } from 'sequelize';

const NewsCategoriesEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: { msg: 'Tiêu đề không được bỏ trống.' },
      notEmpty: { msg: 'Tiêu đề không được bỏ trống.' },
    },
  },
  slug: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  index: {
    type: DataTypes.INTEGER, defaultValue: 0,
  },
  thumbnail: {
    type: DataTypes.TEXT,
    allowNull: true,
    get (): string {
      const thumbnail = this.getDataValue('thumbnail') === null
        ? null
        : `${settings.imageStorageHost}/${this.getDataValue('thumbnail')}`;
      return thumbnail;
    },
    set (value: string) {
      value = value.replace(settings.imageStorageHost + '/', '');
      return value;
    },
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default NewsCategoriesEntity;
