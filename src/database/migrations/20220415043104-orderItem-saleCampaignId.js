
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('order_items', 'saleCampaignId', {
      type: Sequelize.INTEGER, allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'bonusCoinUserBirthday', {
      type: Sequelize.INTEGER, allowNull: true, defaultValue: 0,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'bonusCoinDonexBirthday', {
      type: Sequelize.INTEGER, allowNull: true, defaultValue: 0,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'donexBirthDay', {
      type: Sequelize.DATE, allowNull: true, defaultValue: 0,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('order_items', 'saleCampaignId', { transaction }),
    queryInterface.removeColumn('system_settings', 'bonusCoinUserBirthday', { transaction }),
    queryInterface.removeColumn('system_settings', 'bonusCoinDonexBirthday', { transaction }),
    queryInterface.removeColumn('system_settings', 'donexBirthDay', { transaction }),
  ])),
};
