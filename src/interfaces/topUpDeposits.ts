interface TopUpDepositInterface {
  id: number;
  code: string;
  creatableType: string;
  ownerId: number;
  type: string;
  transactionId: string;
  status: string;
  amount: number;
  note: string;
  portalConfirmAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default TopUpDepositInterface;
