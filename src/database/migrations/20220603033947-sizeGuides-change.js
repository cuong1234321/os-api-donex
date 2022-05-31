'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('size_guides', 'sizeType', {
      type: Sequelize.ENUM({ values: ['kidSize', 'clothesSize', 'shoesSize'] }),
      defaultValue: 'clothesSize',
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('size_guides', 'sizeType', {
      type: Sequelize.ENUM({ values: ['kidSize', 'adultSize', 'shoesSize'] }),
      defaultValue: 'adultSize',
    }, { transaction })])),
};
