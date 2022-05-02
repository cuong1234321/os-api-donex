'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('history_earned_points', 'type', {
      type: Sequelize.ENUM({ values: ['subtract', 'add'] }), defaultValue: 'add',
    }, { transaction }),
    queryInterface.renameColumn('history_earned_points', 'applicationAbleType', 'mutableType', { transaction }),
    queryInterface.renameColumn('history_earned_points', 'applicationAbleId', 'mutableId', { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('history_earned_points', 'type', { transaction }),
    queryInterface.renameColumn('history_earned_points', 'mutableType', 'applicationAbleType', { transaction }),
    queryInterface.renameColumn('history_earned_points', 'mutableId', 'applicationAbleId', { transaction }),
  ])),
};
