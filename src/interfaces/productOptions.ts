
interface ProductOptionInterface {
  id: number;
  productId: number;
  key: string;
  value: number;
  thumbnail: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default ProductOptionInterface;
