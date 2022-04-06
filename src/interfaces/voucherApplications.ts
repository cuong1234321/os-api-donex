interface VoucherApplicationInterface {
  id: number;
  thumbnail: string;
  title: string;
  code: string;
  paymentMethod: string;
  beneficiaries: string;
  description: string;
  adminId: number;
  status: string;
  appliedAt: Date;
  expiredAt: Date;
  recipientLevel: string;
  isAlreadySent: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

};

export default VoucherApplicationInterface;
