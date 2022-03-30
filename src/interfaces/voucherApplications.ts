interface VoucherApplicationInterface {
  id: number;
  title: string;
  type: string;
  amount: string;
  appliedAt: Date;
  appliedTo: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default VoucherApplicationInterface;
