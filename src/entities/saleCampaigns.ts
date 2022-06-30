import { DataTypes } from 'sequelize';

const SaleCampaignEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  applicationTarget: {
    type: DataTypes.ENUM({ values: ['allProduct', 'productCategory', 'singleProduct'] }),
    defaultValues: 'allProduct',
  },
  calculatePriceType: {
    type: DataTypes.ENUM({ values: ['reduceByAmount', 'reduceByPercent', 'increaseByAmount', 'increaseByPercent'] }),
    defaultValues: 'reduceByAmount',
  },
  value: {
    type: DataTypes.BIGINT, allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN, defaultValue: true,
  },
  isApplyToDistributor: {
    type: DataTypes.BOOLEAN, defaultValue: false,
  },
  isApplyToAgency: {
    type: DataTypes.BOOLEAN, defaultValue: false,
  },
  isApplyToCollaborator: {
    type: DataTypes.BOOLEAN, defaultValue: false,
  },
  isApplyToUser: {
    type: DataTypes.BOOLEAN, defaultValue: false,
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

export default SaleCampaignEntity;
