import { DataTypes } from 'sequelize';

const MarketingNotificationTargetEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  notificationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  targetId: {
    type: DataTypes.INTEGER,
  },
  type: {
    type: DataTypes.ENUM({ values: ['userType'] }),
    defaultValues: 'userType',
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default MarketingNotificationTargetEntity;
