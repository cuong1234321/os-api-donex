interface NewsCategoriesInterface {
  id: number;
  title: string;
  slug: string;
  deletedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export default NewsCategoriesInterface;
