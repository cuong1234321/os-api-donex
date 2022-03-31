interface SystemSettingInterface {
  id: number;
  applicationLink?: number;
  coinConversionLevel?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
};

export default SystemSettingInterface;
