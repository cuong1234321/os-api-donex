
interface WarehouseReceiptVariantInterface {
  id: number,
  warehouseReceiptId: number,
  variantId: number,
  warehouseId: number,
  quantity: number,
  price: number,
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,
};

export default WarehouseReceiptVariantInterface;
