
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('products', 'sizeType', {
      type: Sequelize.ENUM({ values: ['clothes', 'children', 'shoes'] }),
      allowNull: true,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('products', 'sizeType', { transaction }),
  ])),
};
