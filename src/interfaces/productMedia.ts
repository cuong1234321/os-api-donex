interface ProductMediaInterface {
  id: number;
  productId: number;
  source: string;
  type: string;
  isThumbnail: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export default ProductMediaInterface;
