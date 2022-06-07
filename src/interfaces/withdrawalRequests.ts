interface WithdrawalRequestInterface {
  id: number;
  code: string;
  ownerId: number;
  ownerBankId: number;
  amount: number;
  status: string;
  approvalNote: string;
  requestNote: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export default WithdrawalRequestInterface;
