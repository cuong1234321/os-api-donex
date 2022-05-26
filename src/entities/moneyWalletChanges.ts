import { DataTypes } from 'sequelize';

const MoneyWalletChangeEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  ownerId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  type: {
    type: DataTypes.ENUM({ values: ['subtract', 'add'] }), allowNull: false,
  },
  mutableType: {
    type: DataTypes.STRING(30), allowNull: false,
  },
  mutableId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER, allowNull: false,
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

export default MoneyWalletChangeEntity;
