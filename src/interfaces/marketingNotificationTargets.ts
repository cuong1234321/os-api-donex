interface MarketingNotificationTargetInterface {
  id: number;
  notificationId: number;
  targetId: number;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default MarketingNotificationTargetInterface;
