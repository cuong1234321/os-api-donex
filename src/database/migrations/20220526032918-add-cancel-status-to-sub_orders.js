'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('sub_orders', 'cancelReason', {
      type: Sequelize.TEXT, allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'cancelRequestAt', {
      type: Sequelize.DATE, allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'cancelStatus', {
      type: Sequelize.ENUM({ values: ['pending', 'approved', 'rejected'] }), allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'cancelableType', {
      type: Sequelize.ENUM({ values: ['user', 'collaborator', 'agency', 'distributor'] }), allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'cancelableId', {
      type: Sequelize.INTEGER, allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'cancelRejectNote', {
      type: Sequelize.TEXT, allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('sub_orders', 'cancelReason', { transaction }),
    queryInterface.removeColumn('sub_orders', 'cancelRequestAt', { transaction }),
    queryInterface.removeColumn('sub_orders', 'cancelStatus', { transaction }),
    queryInterface.removeColumn('sub_orders', 'cancelableType', { transaction }),
    queryInterface.removeColumn('sub_orders', 'cancelableId', { transaction }),
    queryInterface.removeColumn('sub_orders', 'cancelRejectNote', { transaction }),
  ])),
};
