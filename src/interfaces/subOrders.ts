import OrderItemInterface from './orderItems';
import OrderInterface from './orders';
import WarehouseInterface from './warehouses';

interface SubOrderInterface {
  id: number;
  code: string;
  orderId: number;
  warehouseId: number;
  subTotal: number;
  shippingFee: number;
  shippingDiscount?: number;
  total: number;
  shippingCode?: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  shippingFeeMisa: number;
  deposit: number;
  deliveryType: string;
  deliveryInfo: string;
  note: string;
  shippingType: string;
  shippingAttributeType: string;
  status?: string;
  orderFinishAt?: Date;
  paymentStatus: string;
  orderPartnerCode: string;
  pickUpAt?: Date;
  billId: number;
  rankDiscount: number;
  voucherDiscount: number;
  coinUsed: number;
  coinDiscount: number;
  isAlreadyRating: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  items?: OrderItemInterface[];
  order?: OrderInterface;
  warehouse?: WarehouseInterface;
};

export default SubOrderInterface;
