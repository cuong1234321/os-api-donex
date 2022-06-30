'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeIndex('news_categories', '`unique_slug`', { transaction }),
    queryInterface.removeIndex('news', '`unique_slug`', { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addIndex('news', ['slug'], {
      unique: true,
      name: 'unique_slug',
    }, { transaction }),
    queryInterface.addIndex('news_categories', ['slug'], {
      unique: true,
      name: 'unique_slug',
    }, { transaction }),
  ])),
};
