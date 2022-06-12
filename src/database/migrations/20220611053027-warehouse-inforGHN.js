'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sub_order_shippings', 'status');
    return queryInterface.addColumn('sub_order_shippings', 'status', {
      type: Sequelize.ENUM({ values: ['pending', 'complete', 'fail'] }), defaultValue: 'pending',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sub_order_shippings', 'status');
    return queryInterface.addColumn('sub_order_shippings', 'status', {
      type: Sequelize.ENUM({ values: ['pending', 'complete'] }), defaultValue: 'pending',
    });
  },
};
