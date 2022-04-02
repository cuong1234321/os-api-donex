'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('users', 'rank', {
      type: Sequelize.ENUM({ values: ['Basic', 'Vip'] }),
      defaultValue: 'Basic',
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('users', 'rank', { transaction }),
  ])),
};
