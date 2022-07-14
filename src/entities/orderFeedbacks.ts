import { DataTypes } from 'sequelize';

const OrderFeedBackEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  subOrderId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  creatableType: {
    type: DataTypes.ENUM({ values: ['user', 'collaborator', 'agency', 'distributor'] }),
    defaultValue: 'user',
    allowNull: true,
  },
  creatableId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  adminConfirmId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  status: {
    type: DataTypes.ENUM({ values: ['pending', 'confirm', 'reject'] }), defaultValue: 'pending',
  },
  content: {
    type: DataTypes.TEXT, allowNull: true,
  },
  rejectReason: {
    type: DataTypes.TEXT, allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default OrderFeedBackEntity;
