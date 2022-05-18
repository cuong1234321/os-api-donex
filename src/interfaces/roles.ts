interface RoleInterface {
  id: number;
  title: string;
  description: string;
  code: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  totalUsers?: number
};

export default RoleInterface;
