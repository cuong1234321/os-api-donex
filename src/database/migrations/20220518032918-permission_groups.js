'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.renameColumn('permission_groups', 'created_at', 'createdAt', { transaction }),
    queryInterface.renameColumn('permission_groups', 'updated_at', 'updatedAt', { transaction }),
    queryInterface.addColumn('permission_groups', 'deletedAt', {
      type: Sequelize.DATE,
    }, { transaction }),
    queryInterface.changeColumn('roles', 'description', {
      type: Sequelize.STRING(255), allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('permission_groups', 'deletedAt'),
    queryInterface.renameColumn('permission_groups', 'createdAt', 'created_at', { transaction }),
    queryInterface.renameColumn('permission_groups', 'updatedAt', 'updated_at', { transaction }),
    queryInterface.changeColumn('roles', 'description', {
      type: Sequelize.STRING(255), allowNull: false,
    }, { transaction }),
  ])),
};
