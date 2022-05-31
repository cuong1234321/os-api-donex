'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.renameColumn('rating_images', 'image', 'source', { transaction }),
    queryInterface.addColumn('rating_images', 'type', {
      type: Sequelize.ENUM({ values: ['image', 'video'] }),
      defaultValue: 'image',
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.renameColumn('rating_images', 'source', 'image', { transaction }),
    queryInterface.removeColumn('rating_images', 'type', { transaction }),
  ])),
};
