import { DataTypes } from 'sequelize';

const VoucherConditionEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  voucherApplicationId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  orderValue: {
    type: DataTypes.INTEGER, allowNull: true, defaultValue: 0,
  },
  discountValue: {
    type: DataTypes.INTEGER, allowNull: true, defaultValue: 0,
  },
  discountType: {
    type: DataTypes.ENUM({ values: ['cash', 'percent'] }),
    defaultValue: 'cash',
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default VoucherConditionEntity;
