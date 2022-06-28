interface NewsCategoriesInterface {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  index: number;
  deletedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export default NewsCategoriesInterface;
