'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('sale_campaign_products', 'price', {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    }, { transaction }),
    queryInterface.changeColumn('sale_campaigns', 'value', {
      type: Sequelize.BIGINT,
      allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('sale_campaign_products', 'price', { transaction }),
    queryInterface.changeColumn('sale_campaigns', 'value', {
      type: Sequelize.BIGINT,
      allowNull: false,
    }, { transaction }),
  ])),
};
