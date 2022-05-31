import { DataTypes } from 'sequelize';

const RatingEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  creatableId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  creatableType: {
    type: DataTypes.ENUM({ values: ['collaborator', 'agency', 'distributor', 'user'] }),
    defaultValue: 'user',
  },
  subOrderId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  productVariantId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  content: {
    type: DataTypes.TEXT, allowNull: true,
  },
  point: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validator: {
      min: 0,
      max: 5,
    },
  },
  status: {
    type: DataTypes.ENUM({ values: ['pending', 'active', 'inactive'] }),
    defaultValue: 'pending',
  },
  adminId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN, defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
};

export default RatingEntity;
