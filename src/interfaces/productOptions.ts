
interface ProductOptionInterface {
  id: number;
  productId: number;
  key: string;
  value: number;
  thumbnail: string[];
  optionMappingId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  valueName?: any;
};

export default ProductOptionInterface;
