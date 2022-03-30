import { DataTypes } from 'sequelize';

const VoucherApplicationEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM({ values: ['amount', 'percent'] }),
    defaultValue: 'amount',
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  appliedAt: {
    type: DataTypes.DATE, allowNull: false,
  },
  appliedTo: {
    type: DataTypes.DATE, allowNull: false,
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

export default VoucherApplicationEntity;
