'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('m_wards', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      districtId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      code: {
        type: Sequelize.STRING(10), allowNull: false,
      },
      title: {
        type: Sequelize.STRING(100), allowNull: false,
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

  down: async (queryInterface) => {
    return queryInterface.dropTable('m_wards');
  },
};
