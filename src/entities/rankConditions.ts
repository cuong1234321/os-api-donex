import { DataTypes } from 'sequelize';

const RankConditionEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  rankId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  orderAmountFrom: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  orderAmountTo: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  discountValue: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  discountType: {
    type: DataTypes.ENUM({ values: ['cash', 'percent'] }),
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

export default RankConditionEntity;
