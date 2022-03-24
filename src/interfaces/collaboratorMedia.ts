interface CollaboratorMediaInterface {
  id: number;
  collaboratorId: number;
  source: string;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default CollaboratorMediaInterface;
