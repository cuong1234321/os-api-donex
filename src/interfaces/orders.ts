import MDistrictInterface from './mDistricts';
import MProvinceInterface from './mProvinces';
import MWardInterface from './mWards';
import SubOrderInterface from './subOrders';

interface OrderInterface {
  id: number;
  code: string;
  ownerId: number;
  orderableType: string;
  orderableId: number;
  creatableType: string;
  creatableId: number;
  paymentMethod: string;
  saleChannel: string;
  subTotal: number;
  shippingFee: number;
  shippingDiscount: number;
  coinUsed: number;
  total: number;
  appliedVoucherId: number;
  shippingFullName: string;
  shippingPhoneNumber: string;
  shippingProvinceId: string;
  shippingDistrictId: string;
  shippingWardId: number;
  shippingAddress: string;
  transactionId: string;
  promotionType: string;
  paidAt?: Date;
  portalConfirmAt?: Date;
  saleCampaignId: number;
  status: string;
  rankDiscount: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  ward?: MWardInterface;
  province?: MProvinceInterface;
  district?: MDistrictInterface;
  subOrders?: SubOrderInterface[];
  applicationDiscount?: number;
};

export default OrderInterface;
