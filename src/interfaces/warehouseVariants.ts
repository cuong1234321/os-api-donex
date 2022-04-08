interface WarehouseVariantInterface {
  id: number,
  warehouseId: number,
  variantId: number,
  quantity: number,
  createdAt?: Date,
  updatedAt?: Date,
};

export default WarehouseVariantInterface;
