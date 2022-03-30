interface VoucherInterface {
  id: number;
  voucherApplicationId: number;
  discount: number;
  userId: number;
  activeAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export default VoucherInterface;
