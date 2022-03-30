'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addIndex('voucher_applications', ['code'], {
      unique: true,
      name: 'unique_code',
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('voucher_applications', '`unique_code`');
  },
};
