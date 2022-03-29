'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sale_campaign_products', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      saleCampaignId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      productVariantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('sale_campaign_products');
  },
};
