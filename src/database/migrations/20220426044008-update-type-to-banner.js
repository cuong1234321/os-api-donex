
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('banners', 'type', {
      type: Sequelize.ENUM({ values: ['homepage', 'product', 'profile', 'news', 'carts'] }),
      defaultValue: 'homepage',
    }, { transaction }),
    queryInterface.changeColumn('banners', 'position', {
      type: Sequelize.ENUM({ values: ['top', 'right', 'newProductSlide', 'newProductBanner', 'flashSale', 'highlight', 'productList', 'productDetail', 'show'] }),
      defaultValue: 'top',
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('banners', 'type', {
      type: Sequelize.ENUM({ values: ['homepage', 'product', 'profile', 'news'] }),
      defaultValue: 'homepage',
    }, { transaction }),
    queryInterface.changeColumn('banners', 'position', {
      type: Sequelize.ENUM({ values: ['top', 'right', 'newProductSlide', 'newProductBanner', 'flashSale', 'highlight', 'productList', 'productDetail'] }),
      defaultValue: 'top',
    }, { transaction }),
  ])),
};
