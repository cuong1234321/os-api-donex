import CartItemInterface from './cartItems';
import WarehouseInterface from './warehouses';

interface CartInterface {
  id: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;

  cartItems? : CartItemInterface[]
  warehouses? : WarehouseInterface[]
  totalBill?: number;
  totalDiscount?: number;
  totalFee?: number;
  totalTax?: number;
  finalAmount?: number;
  totalItems?: number;
  totalVariants?: number;
};

export default CartInterface;
