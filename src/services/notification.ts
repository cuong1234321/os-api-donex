import UserNotificationModel from '@models/userNotifications';
import SubOrderModel from '@models/subOrders';

class SendNotification {
  public static async newVouchers (recipients: any, voucherApplication: any, userType: any) {
    const userNotifications = recipients.map((user: any) => {
      return {
        userId: user.id,
        userType,
        notificationTargetId: 0,
        type: UserNotificationModel.TYPE_ENUM.PROMOTION,
        title: voucherApplication.title,
        content: voucherApplication.description,
      };
    });
    await UserNotificationModel.bulkCreate(userNotifications);
  }

  public static async changStatusOrder (status: string, userType: any, subOrderCode: string, userId: number) {
    let content = '';
    let title = '';
    if (status === SubOrderModel.STATUS_ENUM.DELIVERED) {
      content = `Đơn hàng ${subOrderCode} đã được giao thành công !`;
      title = 'Giao hàng thành công';
    } else if (status === SubOrderModel.STATUS_ENUM.WAITING_TO_TRANSFER) {
      content = `Đơn hàng ${subOrderCode} đã được xác nhận. Theo dõi tiến trình đơn hàng`;
      title = 'Giao hàng đã được xác nhận';
    } else if (status === SubOrderModel.STATUS_ENUM.DELIVERY) {
      content = `Đơn hàng ${subOrderCode} đang được giao tới bạn. Theo dõi tiến trình đơn hàng`;
      title = 'Đơn hàng đang được giao tới bạn';
    } else if (status === SubOrderModel.STATUS_ENUM.FAIL) {
      content = `Đơn hàng ${subOrderCode} thất bại. Theo dõi tiến trình đơn hàng`;
      title = 'Giao hàng thất bại';
    } else if (status === SubOrderModel.STATUS_ENUM.WAITING_TO_PAY) {
      content = `Đơn hàng ${subOrderCode} đang chờ thanh toán. Theo dõi tiến trình đơn hàng`;
      title = 'Đơn hàng đang chờ thanh toán';
    } else if (status === SubOrderModel.STATUS_ENUM.CANCEL) {
      content = `Đơn hàng ${subOrderCode} đã bị hủy. Theo dõi tiến trình đơn hàng`;
      title = 'Đơn hàng đã bị hủy';
    } else if (status === SubOrderModel.STATUS_ENUM.REJECT) {
      content = `Đơn hàng ${subOrderCode} không được duyệt. Theo dõi tiến trình đơn hàng`;
      title = 'Đơn hàng không được duyệt';
    } else if (status === SubOrderModel.STATUS_ENUM.REFUND) {
      content = `Đơn hàng ${subOrderCode} đang được đổi trả. Theo dõi tiến trình đơn hàng`;
      title = 'Đơn hàng đang được đổi trả';
    } else if (status === SubOrderModel.STATUS_ENUM.RETURNED) {
      content = `Đơn hàng ${subOrderCode} đã được gửi lại. Theo dõi tiến trình đơn hàng`;
      title = 'Đơn hàng đã được gửi lại';
    }
    const userNotifications: any = {
      userId,
      userType,
      notificationTargetId: 0,
      content,
      title,
      type: UserNotificationModel.TYPE_ENUM.ORDER,
    };
    await UserNotificationModel.create(userNotifications);
  }

  public static async notiCancelStatus (cancelStatus: string, userType: string, subOrderCode: string, userId: number) {
    let content = '';
    let title = '';
    if (cancelStatus === SubOrderModel.CANCEL_STATUS.PENDING) {
      content = `Yêu cầu hủy đơn hàng ${subOrderCode} của bạn đang chờ chấp nhận!`;
      title = 'Yêu cầu hủy đơn hàng';
    } else if (cancelStatus === SubOrderModel.CANCEL_STATUS.APPROVED) {
      content = `Yêu cầu hủy đơn hàng của bạn đã được chấp nhận. Đơn hàng ${subOrderCode} đã được hủy thành công!`;
      title = 'Chấp nhận yêu cầu hủy đơn';
    } else if (cancelStatus === SubOrderModel.CANCEL_STATUS.REJECTED) {
      content = `Yêu cầu hủy đơn hàng của bạn không được chấp nhận. Đơn hàng ${subOrderCode} không được hủy thành công!`;
      title = 'Yêu cầu hủy đơn thất bại';
    }
    const userNotifications: any = {
      userId,
      userType,
      notificationTargetId: 0,
      content,
      title,
      type: UserNotificationModel.TYPE_ENUM.ORDER,
    };
    await UserNotificationModel.create(userNotifications);
  }

  public static async deleteCoinReward (recipients: any, userType: any) {
    const userNotifications = recipients.map((user: any) => {
      return {
        userId: user.id,
        userType,
        type: UserNotificationModel.TYPE_ENUM.PROMOTION,
        title: 'Thông báo trừ điểm thưởng do không hoạt động',
        content: 'Tổng số điểm đạt được của bạn đã được hệ thống Donex loại bỏ do không có hoạt động trong 365 ngày.',
      };
    });
    await UserNotificationModel.bulkCreate(userNotifications);
  }
}
export default SendNotification;
