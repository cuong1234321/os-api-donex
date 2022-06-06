'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('top_up_deposits', 'creatableType');
    return queryInterface.addColumn('top_up_deposits', 'creatableType', {
      type: Sequelize.ENUM({ values: ['admin', 'seller'] }), defaultValue: 'seller',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('top_up_deposits', 'creatableType');
    return queryInterface.addColumn('top_up_deposits', 'creatableType', {
      type: Sequelize.ENUM({ values: ['admin', 'user'] }), defaultValue: 'user',
    });
  },
};
