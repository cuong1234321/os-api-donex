
interface WarehouseExportInterface {
  id: number,
  adminId: number,
  type: string,
  exportAbleType: string,
  exportAble: string,
  exportDate: Date,
  orderId: number,
  deliverer: string,
  note: string,
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,
};

export default WarehouseExportInterface;
