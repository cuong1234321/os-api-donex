module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('product_media', 'uploadableType', { transaction }),
    queryInterface.removeColumn('product_media', 'uploadableId', { transaction }),
    queryInterface.removeColumn('product_media', 'isAvatar', { transaction }),
    queryInterface.addColumn('product_media', 'productId', {
      type: Sequelize.INTEGER, allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('product_media', 'isThumbnail', {
      type: Sequelize.BOOLEAN, defaultValue: false,
    }, { transaction }),
    queryInterface.changeColumn('product_media', 'source', {
      type: Sequelize.TEXT, allowNull: true,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('product_media', 'uploadableType', {
      type: Sequelize.STRING(50), allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('product_media', 'uploadableId', {
      type: Sequelize.STRING(50), allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('product_media', 'isAvatar', {
      type: Sequelize.STRING(50), allowNull: true,
    }, { transaction }),
    queryInterface.removeColumn('product_media', 'productId', { transaction }),
    queryInterface.removeColumn('product_media', 'isThumbnail', { transaction }),
    queryInterface.changeColumn('product_media', 'source', {
      type: Sequelize.STRING(255), allowNull: false,
    }, { transaction }),
  ])),
};
