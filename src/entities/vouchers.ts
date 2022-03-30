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
  userId: {
    type: DataTypes.INTEGER, allowNull: true,
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
