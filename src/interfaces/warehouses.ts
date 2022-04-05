
interface WarehouseInterface {
  id: number,
  name: string,
  type: string,
  description: string,
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,
};

export default WarehouseInterface;
