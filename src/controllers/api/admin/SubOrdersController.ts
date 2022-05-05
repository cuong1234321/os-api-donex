import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import BillTemplateModel from '@models/billTemplates';
import SubOrderModel from '@models/subOrders';
import { Request, Response } from 'express';
import handlebars from 'handlebars';

class SubOrderController {
  public async show (req: Request, res: Response) {
    try {
      const { subOrderId } = req.params;
      const subOrder = await SubOrderModel.scope([
        { method: ['byId', subOrderId] },
        'withItems',
      ]).findOne();
      if (!subOrder) { return sendError(res, 404, NoData); }
      sendSuccess(res, subOrder);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async showBill (req: Request, res: Response) {
    try {
      const { subOrderId } = req.params;
      const subOrder = await SubOrderModel.scope([
        { method: ['byId', subOrderId] },
        'withItems',
        'withOrders',
      ]).findOne();
      if (!subOrder) { return sendError(res, 404, NoData); }
      const order = subOrder.getDataValue('order');
      const bill = await BillTemplateModel.findByPk(subOrder.billId);
      const formatBill = BillTemplateModel.formatDataBill(order, subOrder);
      const template = handlebars.compile(bill.content);
      const htmlToSend = template(formatBill);
      bill.setDataValue('content', htmlToSend);
      sendSuccess(res, { subOrder, bill });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SubOrderController();
