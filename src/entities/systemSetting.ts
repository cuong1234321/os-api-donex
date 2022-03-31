import { DataTypes } from 'sequelize';

const SystemSettingEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  applicationLink: {
    type: DataTypes.STRING(255), allowNull: true, defaultValue: 0,
  },
  coinConversionLevel: {
    type: DataTypes.INTEGER, allowNull: true, defaultValue: 0,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default SystemSettingEntity;
