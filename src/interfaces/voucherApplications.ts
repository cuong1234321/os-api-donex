interface VoucherApplicationInterface {
  id: number;
  thumbnail: string;
  title: string;
  code: string;
  paymentType: string;
  beneficiaries: string;
  description: string;
  adminId: number;
  status: string;
  appliedAt: Date;
  expiredAt: Date;
  recipientLevel: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

};

export default VoucherApplicationInterface;
