interface UserNotificationInterface {
  id: number;
  userId: number;
  userType: string;
  notificationTargetId: number;
  type: string;
  title: string;
  content: string;
  readAt: Date;
  thumbnail: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default UserNotificationInterface;
