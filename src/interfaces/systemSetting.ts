interface SystemSettingInterface {
  id: number;
  androidAppLink?: string;
  iosAppLink?: string;
  coinConversionLevel?: number;
  hotline?: number;
  hotlineUser?: number;
  hotlineAgency?: number;
  facebookLink?: string;
  instagramLink?: string;
  twitterLink?: string;
  shopeeLink?: string;
  lazadaLink?: string;
  tikiLink?: string;
  amazonLink?: string;
  agencyAffiliate?: number;
  collaboratorAffiliate?: number;
  distributorAffiliate?: number;
  bonusCoinUserBirthday?: number;
  bonusCoinDonexBirthday?: number;
  donexBirthDay?: Date;
  environment?: string;
  accessToken?: string;
  companyCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default SystemSettingInterface;
