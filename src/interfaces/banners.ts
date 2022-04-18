interface BannerInterface {
  id: number,
  title: string,
  linkDirect: string,
  position: string,
  image: string,
  orderId: number,
  isHighLight: boolean,
  type: string,
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,
};

export default BannerInterface;
