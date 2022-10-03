
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

  mainSku?: string;
  sizeTitle?: string;
};

export default WarehouseTransferVariantInterface;
