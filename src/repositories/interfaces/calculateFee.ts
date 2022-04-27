interface CalculateFeeInterface {
  Weight: number,
  Length: number,
  Width: number,
  Height: number,
  From: {
    Address: string,
    ProvinceId: string,
    GHNProvinceId: number,
    DistrictId: string,
    GHNDistrictId: number,
    WardId: string,
    WardName: string,
    GHNWardId: number,
    Longitude: number,
    Latitude: number
  },
  To: {
    Address: string,
    ProvinceId: string,
    GHNProvinceId: number,
    DistrictId: string,
    GHNDistrictId: number,
    WardId: string,
    WardName: string,
    GHNWardId: number,
    Longitude: number,
    Latitude: number
  },
  IsCOD: boolean,
  TotalAmount: number,
  ShippingPaymentType: number,
  number: number,
  CouponCode: string,
  ServiceID: string,
  InsuranceFee: number,
  BranchAddress: string,
  PickupAddressID: string,
  IntegrationApplication: string,
  CompanyCode: string,
  BranchID: string,
  Partner: string
};

export default CalculateFeeInterface;
