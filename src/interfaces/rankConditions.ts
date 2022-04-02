interface RankConditionInterface {
  id: number;
  rankId: number;
  orderAmountFrom: number;
  orderAmountTo: number;
  discountValue: number;
  discountType: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default RankConditionInterface;
