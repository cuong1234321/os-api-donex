'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('product_categories', 'sizeType', {
      type: Sequelize.ENUM({ values: ['shoes', 'clothes'] }),
      defaultValue: 'clothes',
    }, { transaction }),
    queryInterface.addColumn('m_forms', 'slug', {
      type: Sequelize.STRING(255), allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('product_categories', 'sizeType', { transaction }),
    queryInterface.removeColumn('m_forms', 'slug', { transaction }),
  ])),
};
