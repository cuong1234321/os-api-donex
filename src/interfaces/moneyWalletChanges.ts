interface MoneyWalletChangeInterface {
  id: number;
  ownerId: number;
  type: string;
  mutableType: string;
  mutableId: number;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default MoneyWalletChangeInterface;
