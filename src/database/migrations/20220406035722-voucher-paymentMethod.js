'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('voucher_applications', 'paymentType', { transaction }),
    queryInterface.renameColumn('vouchers', 'userId', 'recipientId', { transaction }),
    queryInterface.addColumn('voucher_applications', 'paymentMethod', {
      type: Sequelize.STRING(255), allowNull: false,
    }, { transaction }),
    queryInterface.addColumn('voucher_applications', 'isAlreadySent', {
      type: Sequelize.BOOLEAN, defaultValue: false,
    }, { transaction }),
    queryInterface.addColumn('vouchers', 'recipientType', {
      type: Sequelize.ENUM({ values: ['user', 'collaborator', 'agency', 'distributor'] }),
      defaultValue: 'user',
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('voucher_applications', 'paymentType', {
      type: Sequelize.ENUM({ values: ['all', 'banking', 'vnPAy', 'COD'] }),
      defaultValue: 'all',
    }, { transaction }),
    queryInterface.removeColumn('voucher_applications', 'paymentMethod', { transaction }),
    queryInterface.removeColumn('voucher_applications', 'isAlreadySent', { transaction }),
    queryInterface.removeColumn('vouchers', 'recipientType', { transaction }),
    queryInterface.renameColumn('vouchers', 'recipientId', 'userId', { transaction }),
  ])),
};
