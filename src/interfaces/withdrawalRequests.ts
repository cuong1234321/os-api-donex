interface WithdrawalRequestInterface {
  id: number;
  code: string;
  ownerId: number;
  ownerBankId: number;
  amount: number;
  status: string;
  approvalNote: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export default WithdrawalRequestInterface;
