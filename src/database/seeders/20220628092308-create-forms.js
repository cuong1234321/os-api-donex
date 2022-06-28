'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const forms = [
      {
        id: null,
        title: 'classic',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: null,
        title: 'regular',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert('m_forms', forms, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('m_forms', null, {});
  },
};
