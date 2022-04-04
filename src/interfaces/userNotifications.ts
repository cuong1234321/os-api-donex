interface UserNotificationInterface {
  id: number;
  userId: number;
  notificationTargetId: number;
  type: string;
  title: string;
  content: string;
  readAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export default UserNotificationInterface;
