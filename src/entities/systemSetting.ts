import { DataTypes } from 'sequelize';

const SystemSettingEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  androidAppLink: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  iosAppLink: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  coinConversionLevel: {
    type: DataTypes.INTEGER, allowNull: true, defaultValue: 1000,
  },
  coinFinishOrder: {
    type: DataTypes.FLOAT, defaultValue: 0.5,
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
  agencyAffiliate: {
    type: DataTypes.INTEGER, allowNull: true, defaultValue: 0,
  },
  collaboratorAffiliate: {
    type: DataTypes.INTEGER, allowNull: true, defaultValue: 0,
  },
  distributorAffiliate: {
    type: DataTypes.INTEGER, allowNull: true, defaultValue: 0,
  },
  bonusCoinUserBirthday: {
    type: DataTypes.INTEGER, allowNull: true, defaultValue: 0,
  },
  bonusCoinDonexBirthday: {
    type: DataTypes.INTEGER, allowNull: true, defaultValue: 0,
  },
  donexBirthDay: {
    type: DataTypes.DATE, allowNull: true,
  },
  ratingDuration: {
    type: DataTypes.INTEGER, allowNull: true, defaultValue: 7,
  },
  environment: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  accessToken: {
    type: DataTypes.TEXT, allowNull: true,
  },
  companyCode: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  tawktoScriptUrl: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  seoSetting: {
    type: DataTypes.TEXT, allowNull: true,
  },
  robot: {
    type: DataTypes.TEXT, allowNull: true,
  },
  header: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
  },
  footer: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
  },
  mediaSocial: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
  },
  contact: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
  },
  supportInfo: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
  },
  suggestionKeyword: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
  },
  storeInfo: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default SystemSettingEntity;
