interface OrderFeedbackInterface {
  id: number;
  subOrderId: number;
  creatableType: string;
  creatableId: number;
  adminConfirmId: number;
  status: string;
  content: string;
  rejectReason: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default OrderFeedbackInterface;
