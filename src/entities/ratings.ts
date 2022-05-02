import { DataTypes } from 'sequelize';

const RatingEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  userType: {
    type: DataTypes.ENUM({ values: ['collaborator', 'agency', 'distributor', 'user'] }),
    defaultValue: 'user',
  },
  orderId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  content: {
    type: DataTypes.TEXT, allowNull: false,
  },
  status: {
    type: DataTypes.ENUM({ values: ['pending', 'active', 'inactive'] }),
    defaultValue: 'pending',
  },
  adminId: {
    type: DataTypes.INTEGER, allowNull: false,
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
