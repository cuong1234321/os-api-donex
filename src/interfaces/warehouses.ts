
interface WarehouseInterface {
  id: number,
  name: string,
  type: string,
  status: string,
  code: string,
  description: string,
  address: string;
  provinceId: number;
  districtId: number;
  wardId: number;
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,

  cartItems?: any[];
};

export default WarehouseInterface;
