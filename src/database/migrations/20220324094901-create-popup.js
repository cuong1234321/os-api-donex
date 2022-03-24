'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('popups', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      image: {
        type: Sequelize.TEXT, allowNull: true,
      },
      title: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      link: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      frequency: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      applyAt: {
        type: Sequelize.DATE, allowNull: true,
      },
      applyTo: {
        type: Sequelize.DATE, allowNull: true,
      },
      status: {
        type: Sequelize.ENUM({ values: ['active', 'inactive'] }), defaultValue: 'inactive',
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
    await queryInterface.dropTable('popups');
  },
};
