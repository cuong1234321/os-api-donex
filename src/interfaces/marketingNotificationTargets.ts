interface MarketingNotificationTargetInterface {
  id: number;
  notificationId: number;
  targetId: number;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default MarketingNotificationTargetInterface;
