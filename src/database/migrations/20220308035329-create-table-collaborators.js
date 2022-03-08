'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('collaborators', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      parentId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      type: {
        type: Sequelize.ENUM({ values: ['collaborator', 'agency', 'distributor'] }),
        defaultValue: 'collaborator',
      },
      status: {
        type: Sequelize.ENUM({ values: ['pending', 'active', 'inactive', 'rejected'] }),
        defaultValue: 'pending',
      },
      paperProofFront: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      paperProofBack: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    }, {
      uniqueKeys: {
        user_id: { fields: ['userId'] },
      },
    }
    , {
      charset: 'utf8mb4',
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('collaborators');
  },
};
