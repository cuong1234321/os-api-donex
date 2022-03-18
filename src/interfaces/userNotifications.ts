interface UserNotificationInterface {
  id: number;
  userId: number;
  notificationTargetId: number;
  title: string;
  content: string;
  readAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export default UserNotificationInterface;
