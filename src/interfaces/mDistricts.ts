interface MDistrictInterface {
  id: number;
  provinceId: number;
  code: string;
  title: string;
  misaCode: string;
  ghnDistrictId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default MDistrictInterface;
