
interface WarehouseInterface {
  id: number,
  name: string,
  type: string,
  status: string,
  code: string,
  description: string,
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,
};

export default WarehouseInterface;
