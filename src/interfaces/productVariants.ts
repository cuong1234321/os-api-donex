interface ProductVariantInterface {
  id: number;
  productId: number;
  name: string;
  slug: string;
  skuCode: string;
  barCode: string;
  buyPrice: string;
  sellPrice: string;
  stock: number;
  optionMappingIds?: number[]
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default ProductVariantInterface;
