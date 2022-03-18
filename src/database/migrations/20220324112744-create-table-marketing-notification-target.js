'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('marketing_notification_targets', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      notificationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      targetId: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.ENUM({ values: ['userType'] }),
        defaultValues: 'userType',
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('marketing_notification_targets');
  },
};
