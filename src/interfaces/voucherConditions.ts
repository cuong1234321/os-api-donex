interface VoucherConditionInterface {
  id: number;
  voucherApplicationId: number;
  discountValue: number;
  orderValue: number;
  discountType: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default VoucherConditionInterface;
