'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('sub_orders', 'affiliateStatus', {
      type: Sequelize.ENUM({ values: ['pending', 'confirm'] }),
      defaultValue: 'pending',
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('sub_orders', 'affiliateStatus', { transaction }),
  ])),
};
