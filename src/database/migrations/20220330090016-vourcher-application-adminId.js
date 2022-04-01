
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('voucher_applications', 'value', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('voucher_applications', 'adminId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn('voucher_applications', 'thumbnail', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('voucher_applications', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
    await queryInterface.addColumn('vouchers', 'deletedAt', {
      type: Sequelize.DATE,
    });
    await queryInterface.removeColumn('voucher_applications', 'type');
    return queryInterface.addColumn('voucher_applications', 'type', {
      type: Sequelize.ENUM({ values: ['cash', 'percent'] }),
      defaultValue: 'cash',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('voucher_applications', 'value');
    await queryInterface.removeColumn('voucher_applications', 'adminId');
    await queryInterface.removeColumn('voucher_applications', 'thumbnail');
    await queryInterface.removeColumn('voucher_applications', 'isActive');
    await queryInterface.removeColumn('vouchers', 'deletedAt');
    await queryInterface.removeColumn('voucher_applications', 'type');
    return queryInterface.addColumn('voucher_applications', 'type', {
      type: Sequelize.ENUM({ values: ['amount', 'percent'] }),
      defaultValue: 'amount',
    });
  },
};
