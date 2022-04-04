import { DataTypes } from 'sequelize';

const UserNotificationEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  notificationTargetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM({ values: ['order', 'promotion', 'system'] }),
  },
  title: {
    type: DataTypes.STRING(255),
  },
  content: {
    type: DataTypes.TEXT,
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
