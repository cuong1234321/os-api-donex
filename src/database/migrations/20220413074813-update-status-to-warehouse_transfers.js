
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('warehouse_transfers', 'status', {
      type: Sequelize.ENUM({ values: ['pending', 'confirm', 'reject'] }),
      defaultValue: 'pending',
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('warehouse_transfers', 'status', {
      type: Sequelize.ENUM({ values: ['pending', 'confirm'] }),
      defaultValue: 'pending',
    });
  },
};
