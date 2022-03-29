'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sale_campaigns', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      applicationTarget: {
        type: Sequelize.ENUM({ values: ['allProduct', 'productCategory', 'singleProduct'] }),
        defaultValues: 'allProduct',
      },
      productCategoryId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      calculatePriceType: {
        type: Sequelize.ENUM({ values: ['reduceByAmount', 'reduceByPercent', 'increaseByAmount', 'increaseByPercent'] }),
        defaultValues: 'reduceByAmount',
      },
      value: {
        type: Sequelize.BIGINT, allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN, defaultValue: true,
      },
      isApplyToDistributor: {
        type: Sequelize.BOOLEAN, defaultValue: false,
      },
      isApplyToAgency: {
        type: Sequelize.BOOLEAN, defaultValue: false,
      },
      isApplyToCollaborator: {
        type: Sequelize.BOOLEAN, defaultValue: false,
      },
      isApplyToUser: {
        type: Sequelize.BOOLEAN, defaultValue: false,
      },
      appliedAt: {
        type: Sequelize.DATE, allowNull: false,
      },
      appliedTo: {
        type: Sequelize.DATE, allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sale_campaigns');
  },
};
