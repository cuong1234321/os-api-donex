import { DataTypes } from 'sequelize';

const TermsEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  type: {
    type: DataTypes.ENUM({ values: ['ruleUsingBonusPoint', 'guideHuntingBonusPoint', 'introduce', 'guideBuy', 'guideChooseSize', 'policy', 'chanceJob', 'transport'] }), allowNull: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT({ length: 'long' }),
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default TermsEntity;
