
interface WarehouseExportVariantInterface {
  id: number,
  warehouseExportId: number,
  variantId: number,
  warehouseId: number,
  quantity: number,
  price: number,
  totalPrice: number,
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,
};

export default WarehouseExportVariantInterface;
