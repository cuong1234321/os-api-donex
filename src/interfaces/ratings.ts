import UserInterface from './users';

interface RatingInterface {
  id: number;
  creatableId: number;
  creatableType: string;
  subOrderId: number;
  productVariantId: number;
  content: string;
  point: number;
  status: string;
  adminId: number;
  isAnonymous: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  user?: UserInterface
};

export default RatingInterface;
