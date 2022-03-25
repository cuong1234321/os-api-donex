import { DataTypes } from 'sequelize';

const MarketingNotificationEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
  link: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  isSentImmediately: {
    type: DataTypes.BOOLEAN,
  },
  sendAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM({ values: ['pending', 'sended'] }),
    defaultValue: 'pending',
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: true,
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

export default MarketingNotificationEntity;
