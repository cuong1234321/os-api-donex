import { DataTypes } from 'sequelize';

const SellerLevelEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  type: {
    type: DataTypes.ENUM({ values: ['collaborator', 'agency', 'distributor'] }),
    defaultValue: 'collaborator',
  },
  title: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  conditionValue: {
    type: DataTypes.BIGINT, allowNull: false,
  },
  discountValue: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  description: {
    type: DataTypes.TEXT, allowNull: true,
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

export default SellerLevelEntity;
