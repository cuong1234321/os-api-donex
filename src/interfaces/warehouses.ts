import CartItemInterface from './cartItems';
import WarehouseVariantInterface from './warehouseVariants';

interface WarehouseInterface {
  id: number,
  name: string,
  type: string,
  status: string,
  code: string,
  description: string,
  address: string;
  provinceId: number;
  districtId: number;
  wardId: number;
  phoneNumber: string;
  warehouseManager: string;
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,

  cartItems?: CartItemInterface[];
  totalBill?: number;
  totalFee?: number;
  totalTax?: number;
  coinDiscount?: number;
  voucherDiscount?: number;
  rankDiscount?: number;
  dailyDiscount?: number;
  totalDiscount?: number;
  finalAmount?: number;
  warehouseVariants?: WarehouseVariantInterface[];
  ghnDistrictId?: number;
};

export default WarehouseInterface;
