interface HistoryEarnedPointInterface {
  id: number;
  userId: number;
  userType: string;
  applicationAbleId: number;
  applicationAbleType: string;
  point: number;
  isAlreadyAlert: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default HistoryEarnedPointInterface;
