'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.createTable('warehouses', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      type: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      description: {
        type: Sequelize.TEXT, allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    }, {
      charset: 'utf8mb4',
    }, { transaction }),
    queryInterface.addColumn('warehouseReceiptVariants', 'totalPrice', {
      type: Sequelize.BIGINT,
      allowNull: true,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.dropTable('warehouses', { transaction }),
    queryInterface.removeColumn('warehouseReceiptVariants', 'totalPrice', { transaction }),
  ])),
};
