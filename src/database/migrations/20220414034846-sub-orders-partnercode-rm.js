
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sub_orders', 'partnerCode');
    await queryInterface.removeColumn('orders', 'saleChannel');
    await queryInterface.addColumn('orders', 'saleChannel', {
      type: Sequelize.ENUM({ values: ['facebook', 'lazada', 'shopee', 'tiki', 'wholesale', 'other', 'retail'] }), allowNull: true, defaultValue: 'retail',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sub_orders', 'partnerCode', {
      type: Sequelize.STRING(255), allowNull: true,
    });
    await queryInterface.removeColumn('orders', 'saleChannel');
    await queryInterface.addColumn('orders', 'saleChannel', {
      type: Sequelize.ENUM({ values: ['facebook', 'lazada', 'shopee', 'tiki', 'wholesale', 'other'] }), allowNull: false,
    });
  },
};
