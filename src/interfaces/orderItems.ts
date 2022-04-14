interface OrderItemInterface {
  id: number;
  subOrderId: number;
  productVariantId: number;
  quantity: number;
  sellingPrice: number;
  commission?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default OrderItemInterface;
