import { sendError, sendSuccess } from '@libs/response';
import SubOrderModel from '@models/subOrders';
import { Request, Response } from 'express';

class GhnCallBackController {
  static readonly CALLBACK_PERMITTED_PARAMETERS = [
    'CODAmount', 'CODTransferDate', 'ClientOrderCode', 'Description', 'OrderCode', 'Reason', 'Status', 'Time', 'Type', 'Warehouse',
  ]

  static readonly MAPPING_STATUS: any = {
    ready_to_pick: 'waitingToTransfer',
    picking: 'waitingToTransfer',
    money_collect_picking: 'waitingToTransfer',
    picked: 'delivery',
    storing: 'delivery',
    transporting: 'delivery',
    delivering: 'delivery',
    money_collect_delivering: 'delivery',
    delivery_fail: 'delivery',
    delivered: 'delivered',
    waiting_to_return: 'delivered',
    return: 'delivered',
    return_transporting: 'delivered',
    return_sorting: 'delivered',
    returning: 'delivered',
    return_fail: 'delivered',
    returned: 'delivered',
    cancel: 'cancel',
    damage: 'cancel',
    lost: 'cancel',
  }

  public async orderStatus (req: Request, res: Response) {
    try {
      const params = req.body;
      console.log('-------------------callback ghn', params);
      if (params.Type === 'Switch_status') {
        const subOrder = await SubOrderModel.scope([
          { method: ['byOrderPartnerCode', params.OrderCode] },
        ]).findOne();
        if (!subOrder) { return sendSuccess(res, {}); }
        const updateParams: any = { status: GhnCallBackController.MAPPING_STATUS[params.Status] };
        await subOrder.update(updateParams);
      }
      sendSuccess(res, {});
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new GhnCallBackController();
