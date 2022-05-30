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
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  shippingFee: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  shippingDiscount: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
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
  weight: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  length: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  width: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  height: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  shippingFeeMisa: {
    type: DataTypes.BIGINT, allowNull: true,
  },
  deposit: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  deliveryType: {
    type: DataTypes.STRING(255),
    defaultValue: 'partner',
  },
  deliveryInfo: {
    type: DataTypes.TEXT, allowNull: true,
  },
  note: {
    type: DataTypes.TEXT, allowNull: true,
  },
  shippingType: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  shippingAttributeType: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  paymentStatus: {
    type: DataTypes.STRING(255),
    defaultValue: 'pending',
  },
  orderPartnerCode: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  billId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  rankDiscount: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  voucherDiscount: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  coinUsed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isAlreadyRating: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  coinDiscount: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  cancelReason: {
    type: DataTypes.TEXT, allowNull: true,
  },
  cancelRequestAt: {
    type: DataTypes.DATE, allowNull: true,
  },
  cancelStatus: {
    type: DataTypes.ENUM({ values: ['pending', 'approved', 'rejected'] }), allowNull: true,
  },
  cancelableType: {
    type: DataTypes.ENUM({ values: ['user', 'collaborator', 'agency', 'distributor'] }), allowNull: true,
  },
  cancelableId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  cancelRejectNote: {
    type: DataTypes.TEXT, allowNull: true,
  },
  tax: {
    type: DataTypes.INTEGER, defaultValue: 0,
  },
  affiliateDiscount: {
    type: DataTypes.INTEGER, defaultValue: 0,
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
