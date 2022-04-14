import OrderItemInterface from './orderItems';

interface SubOrderInterface {
  id: number;
  code: string;
  partnerCode: string;
  orderId: number;
  warehouseId: number;
  subTotal: number;
  shippingFee: number;
  shippingDiscount?: number;
  total: number;
  shippingCode?: string;
  status?: string;
  orderFinishAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  items?: OrderItemInterface[];
};

export default SubOrderInterface;
