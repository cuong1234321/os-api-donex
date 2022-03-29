
interface ProductCategoryInterface {
  id: number;
  parentId: number;
  name: string;
  slug: string;
  thumbnail: string;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  children?: ProductCategoryInterface[];
};

export default ProductCategoryInterface;
