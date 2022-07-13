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

  public static async successOrderUser (user: any, userType: any) {
    const userNotification: any = {
      userId: user.id,
      userType,
      type: UserNotificationModel.TYPE_ENUM.ORDER,
      title: 'Đặt hàng thành công',
      content: 'Đơn hàng của bạn đã được đặt thành công.',
    };
    await UserNotificationModel.create(userNotification);
  }

  public static async newOrderAdmin (admin: any, userType: any) {
    const userNotification: any = {
      userId: admin.id,
      userType,
      type: UserNotificationModel.TYPE_ENUM.ORDER,
      title: 'Thông báo đơn hàng mới',
      content: 'Hệ thống donex thông báo có đơn hàng mới về kho của bạn.',
    };
    await UserNotificationModel.create(userNotification);
  }

  public static async adminOrderToSeller (sellerId: number, userType: string) {
    const userNotification: any = {
      userId: sellerId,
      userType,
      type: UserNotificationModel.TYPE_ENUM.ORDER,
      title: 'Quản trị viên đã tạo đơn mới cho bạn.',
      content: 'Hệ thống donex thông báo quản trị viên đã tạo đơn mới cho bạn. Bạn hãy vào danh sách đơn hàng để xác nhận đơn hàng.',
    };
    await UserNotificationModel.create(userNotification);
  }

  public static async confirmAdminOrderToSeller (adminId: number, subOrderCode: string) {
    const userNotification: any = {
      userId: adminId,
      userType: 'admin',
      type: UserNotificationModel.TYPE_ENUM.ORDER,
      title: 'CTV/ĐL/NPP đã xác nhận đơn đặt hộ.',
      content: `Đơn hàng ${subOrderCode} đã được CTV/ĐL/NPP xác nhận đặt hộ.`,
    };
    await UserNotificationModel.create(userNotification);
  }
}
export default SendNotification;
