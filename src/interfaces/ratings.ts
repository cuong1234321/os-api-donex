interface RatingInterface {
  id: number;
  userId: number;
  userType: string;
  orderId: number;
  content: string;
  status: string;
  adminId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default RatingInterface;
