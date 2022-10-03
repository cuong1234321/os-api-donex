interface WarehouseTransferInterface {
  id: number,
  adminId: number,
  code: string,
  fromWarehouseId: number,
  toWarehouseId: number,
  transferDate: Date,
  note: string,
  status: string,
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,

  productVariantGroupByMainSku?: any;
};

export default WarehouseTransferInterface;
