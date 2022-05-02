import { DataTypes } from 'sequelize';

const OrderEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  code: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  ownerId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  orderableType: {
    type: DataTypes.ENUM({ values: ['user', 'collaborator', 'distributor', 'agency'] }), defaultValue: 'user',
  },
  orderableId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  creatableType: {
    type: DataTypes.ENUM({ values: ['user', 'admin', 'supplier', 'collaborator', 'distributor'] }), defaultValue: 'user',
  },
  creatableId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  paymentMethod: {
    type: DataTypes.ENUM({ values: ['banking', 'vnPay', 'COD', 'wallet'] }), allowNull: false,
  },
  saleChannel: {
    type: DataTypes.ENUM({ values: ['facebook', 'lazada', 'shopee', 'tiki', 'wholesale', 'other', 'retail'] }), allowNull: true, defaultValue: 'retail',
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
  coinUsed: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  total: {
    type: DataTypes.BIGINT, allowNull: true,
  },
  appliedVoucherId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  shippingFullName: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  shippingPhoneNumber: {
    type: DataTypes.STRING(30), allowNull: false,
  },
  shippingProvinceId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  shippingDistrictId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  shippingWardId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  shippingAddress: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  transactionId: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  promotionType: {
    type: DataTypes.STRING(255), allowNull: true, defaultValue: 'userVoucher',
  },
  paidAt: {
    type: DataTypes.DATE, allowNull: true,
  },
  portalConfirmAt: {
    type: DataTypes.DATE, allowNull: true,
  },
  saleCampaignId: {
    type: DataTypes.INTEGER, allowNull: true,
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

export default OrderEntity;
