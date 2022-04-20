import OrderItemInterface from './orderItems';
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
  status?: string;
  orderFinishAt?: Date;
  pickUpAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  items?: OrderItemInterface[];
  warehouse?: WarehouseInterface;
};

export default SubOrderInterface;
