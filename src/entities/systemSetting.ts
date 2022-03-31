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
  hotline: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  hotlineUser: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  hotlineAgency: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  facebookLink: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  instagramLink: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  twitterLink: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  shopeeLink: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  lazadaLink: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  tikiLink: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  amazonLink: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default SystemSettingEntity;
