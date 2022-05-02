'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('ratings', 'productVariantId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }, { transaction }),
    queryInterface.addColumn('ratings', 'point', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }, { transaction }),
    queryInterface.renameColumn('ratings', 'orderId', 'subOrderId', { transaction }),
    queryInterface.renameColumn('ratings', 'userId', 'creatableId', { transaction }),
    queryInterface.renameColumn('ratings', 'userType', 'creatableType', { transaction }),
    queryInterface.changeColumn('ratings', 'adminId', { type: Sequelize.INTEGER, allowNull: true }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('ratings', 'productVariantId', { transaction }),
    queryInterface.removeColumn('ratings', 'point', { transaction }),
    queryInterface.renameColumn('ratings', 'subOrderId', 'orderId', { transaction }),
    queryInterface.renameColumn('ratings', 'creatableType', 'userType', { transaction }),
    queryInterface.renameColumn('ratings', 'creatableId', 'userId', { transaction }),
    queryInterface.changeColumn('ratings', 'adminId', { type: Sequelize.INTEGER, allowNull: false }, { transaction }),
  ])),
};
