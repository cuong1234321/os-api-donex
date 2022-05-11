import RankConditionInterface from './rankConditions';

interface RankInterface {
  id: number;
  type?: string;
  title?: string;
  orderValueFrom?: number;
  dateEarnDiscount?: string[];
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  conditions?: RankConditionInterface[];
};

export default RankInterface;
