interface FavoriteProductInterface {
  id: number;
  userId: number;
  productId: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export default FavoriteProductInterface;
