import settings from '@configs/settings';
import { sendError, sendSuccess } from '@libs/response';
import OrderModel from '@models/orders';
import TopUpDepositModel from '@models/topUpDeposits';
import VnpayPaymentService from '@services/vnpayPayment';
import dayjs from 'dayjs';
import { Request, Response } from 'express';

class VnPayCallBackController {
  static readonly ORDERABLE_TYPE = { ORDER: 'order', TOP_UP_DEPOSIT: 'topUpDeposit' }
  public async paymentConfirmCallback (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(VnpayPaymentService.QUERYABLE_PARAMETERS).value();
      let orderableInstance: TopUpDepositModel | OrderModel;
      let orderValue: number;
      let paidAt: Date;
      switch (params.vnp_TxnRef.split('_')[0]) {
        case VnpayPaymentService.TXN_REF_PREFIX.ORDER:
          orderableInstance = await OrderModel.scope([
            { method: ['byTransactionId', params.vnp_TxnRef] },
          ]).findOne();
          orderValue = orderableInstance?.subTotal;
          paidAt = orderableInstance?.paidAt;
          break;
        default:
          orderableInstance = await TopUpDepositModel.scope([
            { method: ['byPayment', params.vnp_TxnRef] },
          ]).findOne();
          orderValue = orderableInstance?.amount;
          paidAt = orderableInstance?.portalConfirmAt;
          break;
      }
      if (!orderableInstance) return res.status(200).json({ Message: 'Order Not Found', RspCode: '01' });
      if (orderableInstance.status === 'fail') return res.status(200).json({ Message: 'Order Not Found', RspCode: '02' });
      if (Math.ceil(orderValue + (orderValue * (settings.vnPayDefaultFeePercent / 100)) + settings.vnPayDefaultFee) * 100 !== parseInt(params.vnp_Amount, 10)) return res.status(200).json({ Message: 'Invalid amount', RspCode: '04' });
      if (!(await orderableInstance.validSignature(params))) return res.status(200).json({ Message: 'Invalid Checksum', RspCode: '97' });
      if (paidAt) return res.status(200).json({ Message: 'Order already confirmed', RspCode: '02' });
      if (await orderableInstance.isPaid(params)) {
        if (orderableInstance.constructor.name === OrderModel.name) {
          await (orderableInstance as OrderModel).update({ status: OrderModel.STATUS_ENUM.PAID, paidAt: dayjs() });
        }
        if (orderableInstance.constructor.name === TopUpDepositModel.name) {
          await (orderableInstance as TopUpDepositModel).update({ status: TopUpDepositModel.STATUS_ENUM.COMPLETE, portalConfirmAt: dayjs() });
        }
      }
      if (params.vnp_TransactionStatus === '99') {
        if (orderableInstance.constructor.name === OrderModel.name) {
          await (orderableInstance as OrderModel).update({ status: OrderModel.STATUS_ENUM.FAIL });
        }
        if (orderableInstance.constructor.name === TopUpDepositModel.name) {
          await (orderableInstance as TopUpDepositModel).update({ status: TopUpDepositModel.STATUS_ENUM.FAIL });
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
      let orderableInstance: TopUpDepositModel | OrderModel;
      let orderableType: string;
      switch (params.vnp_TxnRef.split('_')[0]) {
        case VnpayPaymentService.TXN_REF_PREFIX.ORDER:
          orderableType = VnPayCallBackController.ORDERABLE_TYPE.ORDER;
          orderableInstance = await OrderModel.scope([
            { method: ['byTransactionId', params.vnp_TxnRef] },
          ]).findOne();
          break;
        default:
          orderableType = VnPayCallBackController.ORDERABLE_TYPE.TOP_UP_DEPOSIT;
          orderableInstance = await TopUpDepositModel.scope([
            { method: ['byPayment', params.vnp_TxnRef] },
          ]).findOne();
          break;
      }
      sendSuccess(res, { orderableInstance, orderableType });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new VnPayCallBackController();
