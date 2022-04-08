interface VoucherInterface {
  id: number;
  voucherApplicationId: number;
  discount?: number;
  recipientId: number;
  recipientType: string;
  activeAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default VoucherInterface;
