'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('orders', 'referralCode', {
      type: Sequelize.STRING(255), allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'affiliateDiscount', {
      type: Sequelize.INTEGER, defaultValue: 0,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('orders', 'referralCode', { transaction }),
    queryInterface.removeColumn('sub_orders', 'affiliateDiscount', { transaction }),
  ])),
};
