
interface WarehouseReceiptInterface {
  id: number,
  adminId: number,
  type: string,
  importAbleType: string,
  importAble: string,
  importDate: Date,
  orderId: number,
  deliverer: string,
  note: string,
  discount: number;
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,
};

export default WarehouseReceiptInterface;
