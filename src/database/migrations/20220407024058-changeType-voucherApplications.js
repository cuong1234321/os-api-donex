'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('voucher_applications', 'beneficiaries');
    return queryInterface.addColumn('voucher_applications', 'beneficiaries', {
      type: Sequelize.ENUM({ values: ['user', 'collaborator', 'agency', 'distributor', 'all'] }),
      defaultValue: 'user',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('voucher_applications', 'beneficiaries');
    return queryInterface.addColumn('voucher_applications', 'beneficiaries', {
      type: Sequelize.ENUM({ values: ['user', 'collaborator', 'agency', 'distributor'] }),
      defaultValue: 'user',
    });
  },
};
