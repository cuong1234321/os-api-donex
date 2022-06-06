import { DataTypes } from 'sequelize';

const TopUpDepositEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  code: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  ownerId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  creatableType: {
    type: DataTypes.ENUM({ values: ['admin', 'seller'] }), defaultValue: 'seller',
  },
  type: {
    type: DataTypes.ENUM({ values: ['vnPay', 'banking'] }), defaultValue: 'vnPay',
  },
  transactionId: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  status: {
    type: DataTypes.ENUM({ values: ['pending', 'complete'] }), defaultValue: 'pending',
  },
  amount: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  note: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  portalConfirmAt: {
    type: DataTypes.DATE,
  },
  createdAt: {
    type: DataTypes.DATE, field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE, field: 'updated_at',
  },
  deletedAt: {
    type: DataTypes.DATE, field: 'deleted_at',
  },
};

export default TopUpDepositEntity;
