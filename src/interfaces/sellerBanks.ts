interface SellerBankInterface {
  id: number;
  sellerId: number;
  bankId: number;
  branch: string;
  ownerName: string;
  accountNumber: string;
  isDefaultAccount: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export default SellerBankInterface;
