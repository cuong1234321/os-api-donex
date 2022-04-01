'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('sale_campaigns', 'productCategoryId', { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('sale_campaigns', 'productCategoryId', {
      type: Sequelize.INTEGER, allowNull: true,
    }, { transaction }),
  ])),
};
