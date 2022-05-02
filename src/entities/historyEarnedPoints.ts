import { DataTypes } from 'sequelize';

const HistoryEarnedPointEntity = {
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
  applicationAbleId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  applicationAbleType: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  point: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  isAlreadyAlert: {
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

export default HistoryEarnedPointEntity;
