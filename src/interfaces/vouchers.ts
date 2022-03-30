interface VoucherInterface {
  id: number;
  voucherApplicationId: number;
  discount: number;
  userId: number;
  activeAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default VoucherInterface;
