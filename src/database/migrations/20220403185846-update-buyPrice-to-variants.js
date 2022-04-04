'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('product_variants', 'buyPrice', {
      type: Sequelize.INTEGER, allowNull: true,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('product_variants', 'buyPrice', {
      type: Sequelize.INTEGER, allowNull: false,
    }, { transaction }),
  ])),
};
