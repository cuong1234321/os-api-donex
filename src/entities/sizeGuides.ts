import { DataTypes } from 'sequelize';

const SizeGuideEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  sizeType: {
    type: DataTypes.ENUM({ values: ['kidSize', 'adultSize', 'shoesSize'] }),
    defaultValue: 'adultSize',
  },
  mediaType: {
    type: DataTypes.ENUM({ values: ['image', 'video'] }),
    defaultValue: 'image',
  },
  source: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE, field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE, field: 'updated_at',
  },
};

export default SizeGuideEntity;
