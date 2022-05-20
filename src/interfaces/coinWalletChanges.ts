interface CoinWalletChangeInterface {
  id: number;
  userId: number;
  type: string;
  mutableType: string;
  mutableId: number;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export default CoinWalletChangeInterface;
