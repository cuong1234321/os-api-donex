interface NewsCategoriesInterface {
  id: number;
  title: string;
  description: string;
  avatar: string;
  status: string;
  deletedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export default NewsCategoriesInterface;
