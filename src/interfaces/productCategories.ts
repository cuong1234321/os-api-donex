
interface ProductCategoryInterface {
  id: number;
  parentId: number;
  name: string;
  slug: string;
  thumbnail: string;
  type: string;
  index: number;
  misaId?: string;
  sizeType: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  children?: ProductCategoryInterface[];
};

export default ProductCategoryInterface;
