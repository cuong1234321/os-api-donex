interface BankAccountInterface {
  id: number;
  bankId: number;
  bankAccount: string;
  bankOwner: string;
  qrCode: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

};

export default BankAccountInterface;
