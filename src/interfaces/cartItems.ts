interface CartItemInterface {
  id: number;
  cartId: number;
  productVariantId: number;
  quantity: number;
  warehouseId: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export default CartItemInterface;
