interface HistoryEarnedPointInterface {
  id: number;
  userId: number;
  userType: string;
  type: string;
  mutableId: number;
  mutableType: string;
  point: number;
  isAlreadyAlert: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default HistoryEarnedPointInterface;
