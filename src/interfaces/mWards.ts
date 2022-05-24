import MDistrictInterface from './mDistricts';

interface MWardInterface {
  id: number;
  districtId: number;
  code: string;
  title: string;
  misaCode: string;
  ghnWardCode: string;
  createdAt?: Date;
  updatedAt?: Date;

  district?: MDistrictInterface
};

export default MWardInterface;
