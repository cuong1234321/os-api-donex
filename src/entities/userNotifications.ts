import settings from '@configs/settings';
import { DataTypes } from 'sequelize';

const UserNotificationEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userType: {
    type: DataTypes.ENUM({ values: ['admin', 'user', 'collaborator', 'agency', 'distributor'] }),
    allowNull: true,
  },
  notificationTargetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM({ values: ['order', 'promotion', 'system'] }),
    defaultValue: 'system',
  },
  title: {
    type: DataTypes.STRING(255),
  },
  content: {
    type: DataTypes.TEXT,
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
    set (value: string) {
      if (!value) return;
      if (value.includes(settings.imageStorageHost)) {
        const thumbnail = value.slice(settings.imageStorageHost.length + 1);
        this.setDataValue('thumbnail', thumbnail);
      } else {
        this.setDataValue('thumbnail', value);
      }
    },
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default UserNotificationEntity;
