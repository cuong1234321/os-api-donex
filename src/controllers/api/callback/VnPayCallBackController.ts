import settings from '@configs/settings';
import { sendError, sendSuccess } from '@libs/response';
import OrderModel from '@models/orders';
import VnpayPaymentService from '@services/vnpayPayment';
import dayjs from 'dayjs';
import { Request, Response } from 'express';

class VnPayCallBackController {
  public async paymentConfirmCallback (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(VnpayPaymentService.QUERYABLE_PARAMETERS).value();
      let orderableInstance: OrderModel;
      let orderValue: number;
      let paidAt: Date;
      switch (params.vnp_TxnRef.split('_')[0]) {
        case VnpayPaymentService.TXN_REF_PREFIX.ORDER:
          orderableInstance = await OrderModel.scope([
            { method: ['byStatus', OrderModel.STATUS_ENUM.PENDING] },
            { method: ['byPayment', params.vnp_TxnRef] },
          ]).findOne();
          orderValue = orderableInstance.total;
          paidAt = orderableInstance.paidAt;
          break;
        default:
          break;
      }
      if (!orderableInstance) return res.status(200).json({ Message: 'Order Not Found', RspCode: '01' });
      if ((orderValue + (orderValue * (settings.vnPayDefaultFeePercent / 100)) + settings.vnPayDefaultFee) * 100 !== parseInt(params.vnp_Amount, 10)) return res.status(200).json({ Message: 'Invalid amount', RspCode: '04' });
      if (!(await orderableInstance.validSignature(params))) return res.status(200).json({ Message: 'Invalid Checksum', RspCode: '97' });
      if (paidAt) return res.status(200).json({ Message: 'Order already confirmed', RspCode: '02' });
      if (await orderableInstance.isPaid(params)) {
        if (orderableInstance.constructor.name === OrderModel.name) {
          await (orderableInstance as OrderModel).update({ status: OrderModel.STATUS_ENUM.PAID, paidAt: dayjs() });
        }
      }
      res.status(200).json({ Message: 'Confirm Success', RspCode: '00' });
    } catch (error) {
      if (req.query.vnp_TxnRef) return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
      sendError(res, 500, error.message, error);
    }
  }

  public async paymentConfirmRedirect (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(VnpayPaymentService.QUERYABLE_PARAMETERS).value();
      let orderableInstance: OrderModel;
      switch (params.vnp_TxnRef.split('_')[0]) {
        case VnpayPaymentService.TXN_REF_PREFIX.ORDER:
          orderableInstance = await OrderModel.scope([
            { method: ['byStatus', OrderModel.STATUS_ENUM.PENDING] },
            { method: ['byPayment', params.vnp_TxnRef] },
          ]).findOne();
          break;
        default:
          break;
      }
      sendSuccess(res, { orderableInstance });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new VnPayCallBackController();