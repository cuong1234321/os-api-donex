import { DataTypes } from 'sequelize';

const ProductMediaEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  type: {
    type: DataTypes.ENUM({ values: ['image', 'video'] }),
    defaultValue: 'image',
  },
  source: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  isAvatar: {
    type: DataTypes.BOOLEAN, defaultValue: false,
  },
  uploadableType: {
    type: DataTypes.ENUM({ values: ['groupProduct', 'product'] }),
    defaultValue: 'groupProduct',
  },
  uploadableId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default ProductMediaEntity;
