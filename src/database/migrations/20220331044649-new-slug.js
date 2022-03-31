
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('news_categories', 'slug', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('news', 'newsCategoryId', {
      type: Sequelize.NUMBER, allowNull: false,
    }, { transaction }),
    queryInterface.addColumn('news', 'slug', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('news', 'views', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, { transaction }),
    queryInterface.removeColumn('news_categories', 'description', { transaction }),
    queryInterface.removeColumn('news_categories', 'status', { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('news', 'slug', { transaction }),
    queryInterface.addColumn('news_categories', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('news', 'newsCategoryId', {
      type: Sequelize.NUMBER, allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('news_categories', 'status', {
      type: Sequelize.ENUM({ values: ['active', 'inactive'] }),
      defaultValue: 'active',
    }, { transaction }),
    queryInterface.removeColumn('news_categories', 'slug', { transaction }),
    queryInterface.removeColumn('news', 'views', { transaction }),
  ])),
};
