'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('sub_orders', 'paymentStatus', {
      type: Sequelize.STRING(255),
      defaultValue: 'pending',
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'orderPartnerCode', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('sub_orders', 'paymentStatus', { transaction }),
    queryInterface.removeColumn('sub_orders', 'orderPartnerCode', { transaction }),
  ])),
};
