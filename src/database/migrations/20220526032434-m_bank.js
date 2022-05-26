'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('m_banks', {
      id: {
        type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true,
      },
      code: {
        type: Sequelize.STRING, allowNull: true,
      },
      name: {
        type: Sequelize.STRING, allowNull: true,
      },
      shortName: {
        type: Sequelize.STRING, allowNull: true,
      },
      logo: {
        type: Sequelize.STRING, allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    }, {
      charset: 'utf8mb4',
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('m_banks');
  },
};
