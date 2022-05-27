import { DataTypes } from 'sequelize';

const SellerBankEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  sellerId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  bankId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  branch: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  ownerName: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  accountNumber: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  isDefaultAccount: {
    type: DataTypes.BOOLEAN, defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE, field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE, field: 'updated_at',
  },
};

export default SellerBankEntity;
