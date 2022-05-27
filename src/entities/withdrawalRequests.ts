import { DataTypes } from 'sequelize';

const WithdrawalRequestEntity = {
  id: {
    type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true,
  },
  code: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  ownerId: {
    type: DataTypes.STRING, allowNull: true,
  },
  ownerBankId: {
    type: DataTypes.STRING, allowNull: true,
  },
  amount: {
    type: DataTypes.STRING, allowNull: true,
  },
  status: {
    type: DataTypes.ENUM({ values: ['pending', 'approved', 'rejected'] }), defaultValue: 'pending',
  },
  approvalNote: {
    type: DataTypes.TEXT, allowNull: true,
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

export default WithdrawalRequestEntity;
