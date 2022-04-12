interface CartItemInterface {
  id: number;
  cartId: number;
  productVariantId: number;
  quantity: number;
  warehouseId: number;
  createdAt?: Date;
  updatedAt?: Date;

  variantOptions?: any[];
};

export default CartItemInterface;
