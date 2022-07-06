import WarehouseReceiptInterface from './warehouseReceipts';

interface WarehouseReceiptVariantInterface {
  id: number,
  warehouseReceiptId: number,
  variantId: number,
  warehouseId: number,
  quantity: number,
  price: number,
  totalPrice: number,
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,

  skuCode?: string;
  name?: string;
  unit?: string;
  warehouseReceipt?: WarehouseReceiptInterface;
};

export default WarehouseReceiptVariantInterface;
