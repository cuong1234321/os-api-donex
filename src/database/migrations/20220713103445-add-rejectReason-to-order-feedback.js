'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('order_feedbacks', 'rejectReason', {
      type: Sequelize.TEXT,
      allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('order_feedbacks', 'status', {
      type: Sequelize.ENUM({ values: ['pending', 'confirm', 'reject'] }),
      defaultValue: 'pending',
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('order_feedbacks', 'rejectReason', { transaction }),
    queryInterface.changeColumn('order_feedbacks', 'status', {
      type: Sequelize.ENUM({ values: ['pending', 'confirm'] }),
      defaultValue: 'pending',
    }, { transaction }),
  ])),
};
