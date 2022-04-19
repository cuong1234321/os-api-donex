import { DataTypes } from 'sequelize';

const OrderItemEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  subOrderId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  productVariantId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  sellingPrice: {
    type: DataTypes.BIGINT, allowNull: true,
  },
  commission: {
    type: DataTypes.BIGINT, allowNull: true,
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

export default OrderItemEntity;
