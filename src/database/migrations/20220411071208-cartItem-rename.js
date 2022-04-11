
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.renameColumn('cart_items', 'warehouseVariantId', 'warehouseId', { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.renameColumn('cart_items', 'warehouseId', 'warehouseVariantId', { transaction }),
  ])),
};
