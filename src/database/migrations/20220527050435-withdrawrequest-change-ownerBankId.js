'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.renameColumn('withdrawal_requests', 'userBankId', 'ownerBankId', {
      type: Sequelize.BIGINT, defaultValue: 0,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.renameColumn('withdrawal_requests', 'ownerBankId', 'userBankId', { transaction }),
  ])),
};
