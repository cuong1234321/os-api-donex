interface SellerLevelInterface {
  id: number;
  type: string;
  title: string;
  conditionValue: number;
  discountValue: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default SellerLevelInterface;
