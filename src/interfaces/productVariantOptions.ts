interface ProductVariantOptionInterface {
  id: number;
  variantId: number;
  optionId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  valueName?: string;
};

export default ProductVariantOptionInterface;
