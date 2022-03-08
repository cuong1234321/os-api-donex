
interface CollaboratorInterface {
  id: number,
  userId: number,
  parentId: number,
  type: string,
  status: string,
  paperProofFront: string;
  paperProofBack: string;
  createdAt?: Date,
  updatedAt?: Date,
};

export default CollaboratorInterface;
