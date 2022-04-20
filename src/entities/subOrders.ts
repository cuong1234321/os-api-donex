import { DataTypes } from 'sequelize';

const SubOrderEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  code: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  orderId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  warehouseId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  subTotal: {
    type: DataTypes.BIGINT, allowNull: true,
  },
  shippingFee: {
    type: DataTypes.BIGINT, allowNull: true,
  },
  shippingDiscount: {
    type: DataTypes.BIGINT, allowNull: true,
  },
  total: {
    type: DataTypes.BIGINT, allowNull: true,
  },
  shippingCode: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  status: {
    type: DataTypes.STRING(255), defaultValue: 'pending',
  },
  orderFinishAt: {
    type: DataTypes.DATE, allowNull: true,
  },
  pickUpAt: {
    type: DataTypes.DATE, allowNull: true,
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

export default SubOrderEntity;
