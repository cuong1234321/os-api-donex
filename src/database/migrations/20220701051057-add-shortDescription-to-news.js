'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('news', 'shortDescription', {
      type: Sequelize.TEXT,
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('news', 'seo', {
      type: Sequelize.TEXT,
      allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('news', 'shortDescription', { transaction }),
    queryInterface.removeColumn('news', 'seo', { transaction }),
  ])),
};
