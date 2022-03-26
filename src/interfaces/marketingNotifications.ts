interface MarketingNotificationInterface {
  id: number;
  ownerId: number;
  title: string;
  content: string;
  link: string;
  isSentImmediately: boolean;
  sendAt: Date;
  status: string;
  jobId: number;
  thumbnail: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt: Date;
};

export default MarketingNotificationInterface;
