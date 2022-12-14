import { DataTypes } from 'sequelize';
const SaleCampaignProductEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  saleCampaignId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productVariantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
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

export default SaleCampaignProductEntity;
