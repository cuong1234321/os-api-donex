
interface WarehouseTransferVariantInterface {
  id: number,
  warehouseTransferId: number,
  variantId: number,
  quantity: number,
  price: number,
  totalPrice: number,
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,
};

export default WarehouseTransferVariantInterface;
