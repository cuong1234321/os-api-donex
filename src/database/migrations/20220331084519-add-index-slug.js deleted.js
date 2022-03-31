'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('news', ['slug'], {
      unique: true,
      name: 'unique_slug',
    });
    return queryInterface.addIndex('news_categories', ['slug'], {
      unique: true,
      name: 'unique_slug',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('news_categories', '`unique_slug`');
    return queryInterface.removeIndex('news', '`unique_slug`');
  },
};
