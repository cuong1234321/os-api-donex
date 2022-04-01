
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('voucher_applications', 'type', { transaction }),
    queryInterface.removeColumn('voucher_applications', 'amount', { transaction }),
    queryInterface.removeColumn('voucher_applications', 'value', { transaction }),
    queryInterface.removeColumn('voucher_applications', 'isActive', { transaction }),
    queryInterface.addColumn('voucher_applications', 'status', {
      type: Sequelize.ENUM({ values: ['active', 'inactive'] }),
      defaultValue: 'active',
    }, { transaction }),
    queryInterface.addColumn('voucher_applications', 'paymentType', {
      type: Sequelize.ENUM({ values: ['all', 'banking', 'vnPAy', 'COD'] }),
      defaultValue: 'all',
    }, { transaction }),
    queryInterface.addColumn('voucher_applications', 'beneficiaries', {
      type: Sequelize.ENUM({ values: ['user', 'collaborator', 'agency', 'distributor'] }),
      defaultValue: 'user',
    }, { transaction }),
    queryInterface.addColumn('voucher_applications', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('voucher_applications', 'code', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('voucher_applications', 'recipientLevel', {
      type: Sequelize.ENUM({ values: ['all', 'tier1', 'tier2', 'base', 'vip'] }),
      defaultValue: 'all',
    }, { transaction }),
    queryInterface.renameColumn('voucher_applications', 'appliedTo', 'expiredAt', { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('voucher_applications', 'type', {
      type: Sequelize.ENUM({ values: ['cash', 'percent'] }),
      defaultValue: 'cash',
    }, { transaction }),
    queryInterface.addColumn('voucher_applications', 'amount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }, { transaction }),
    queryInterface.addColumn('voucher_applications', 'value', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    }, { transaction }),
    queryInterface.addColumn('voucher_applications', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    }, { transaction }),
    queryInterface.removeColumn('voucher_applications', 'paymentType', { transaction }),
    queryInterface.removeColumn('voucher_applications', 'beneficiaries', { transaction }),
    queryInterface.removeColumn('voucher_applications', 'description', { transaction }),
    queryInterface.removeColumn('voucher_applications', 'code', { transaction }),
    queryInterface.removeColumn('voucher_applications', 'status', { transaction }),
    queryInterface.removeColumn('voucher_applications', 'recipientLevel', { transaction }),
    queryInterface.renameColumn('voucher_applications', 'expiredAt', 'appliedTo', { transaction }),
  ])),
};
