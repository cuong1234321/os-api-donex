interface CartItemInterface {
  id: number;
  cartId: number;
  productVariantId: number;
  quantity: number;
  warehouseVariantId: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export default CartItemInterface;
