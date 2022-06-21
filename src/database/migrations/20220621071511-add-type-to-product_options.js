'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('product_options', 'key', {
      type: Sequelize.ENUM({ values: ['size', 'color', 'form', 'supportingColor'] }),
    }, { transaction }),
    queryInterface.addColumn('product_variants', 'mainSku', {
      type: Sequelize.STRING(255),
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('product_options', 'key');
    await queryInterface.removeColumn('product_variants', 'mainSku');
    return queryInterface.addColumn('product_options', 'key', {
      type: Sequelize.ENUM({ values: ['size', 'color', 'form'] }),
    });
  },
};
