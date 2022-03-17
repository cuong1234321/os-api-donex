import UserModel from '@models/users';

interface CollaboratorInterface {
  id: number,
  userId: number,
  parentId: number,
  type: string,
  status: string,
  paperProofFront: string;
  paperProofBack: string;
  rejectionReason: string;
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt: Date,

  user?: UserModel,
};

export default CollaboratorInterface;
