'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sub_order_shippings', 'status');
    await queryInterface.addColumn('sub_order_shippings', 'status', {
      type: Sequelize.STRING(255), allowNull: true,
    });
    await queryInterface.removeColumn('top_up_deposits', 'status');
    return queryInterface.addColumn('top_up_deposits', 'status', {
      type: Sequelize.ENUM({ values: ['pending', 'complete', 'fail'] }), defaultValue: 'pending',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sub_order_shippings', 'status');
    await queryInterface.addColumn('sub_order_shippings', 'status', {
      type: Sequelize.ENUM({ values: ['pending', 'complete', 'fail'] }), defaultValue: 'pending',
    });
    await queryInterface.removeColumn('top_up_deposits', 'status');
    return queryInterface.addColumn('top_up_deposits', 'status', {
      type: Sequelize.ENUM({ values: ['pending', 'complete'] }), defaultValue: 'pending',
    });
  },
};
