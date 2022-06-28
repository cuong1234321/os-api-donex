'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('news', 'index', {
      type: Sequelize.INTEGER, defaultValue: 0,
    }, { transaction }),
    queryInterface.addColumn('news_categories', 'index', {
      type: Sequelize.INTEGER, defaultValue: 0,
    }, { transaction }),
    queryInterface.addColumn('news_categories', 'thumbnail', {
      type: Sequelize.TEXT,
    }, { transaction }),
    queryInterface.addColumn('products', 'index', {
      type: Sequelize.INTEGER, defaultValue: 0,
    }, { transaction }),
    queryInterface.addColumn('product_categories', 'index', {
      type: Sequelize.INTEGER, defaultValue: 0,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('news', 'index', { transaction }),
    queryInterface.removeColumn('news_categories', 'index', { transaction }),
    queryInterface.removeColumn('news_categories', 'thumbnail', { transaction }),
    queryInterface.removeColumn('products', 'index', { transaction }),
    queryInterface.removeColumn('product_categories', 'index', { transaction }),
  ])),
};
