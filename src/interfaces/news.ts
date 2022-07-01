interface NewsInterface {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  newsCategoryId: number;
  publicAt: Date;
  status: string;
  slug: string;
  views: number;
  index: number;
  shortDescription: string;
  seo: string;
  deletedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export default NewsInterface;
