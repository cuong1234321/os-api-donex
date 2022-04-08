import { DataTypes } from 'sequelize';

const VoucherEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  voucherApplicationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  recipientId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  recipientType: {
    type: DataTypes.ENUM({ values: ['user', 'collaborator', 'agency', 'distributor'] }),
    defaultValue: 'user',
  },
  activeAt: {
    type: DataTypes.DATE,
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

export default VoucherEntity;
