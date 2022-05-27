import { NoData } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import BillTemplateModel from '@models/billTemplates';
import SubOrderModel from '@models/subOrders';
import { Request, Response } from 'express';
import handlebars from 'handlebars';

class SubOrderController {
  public async index (req: Request, res: Response) {
    try {
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const { code, subOrderId } = req.query;
      const scopes: any = [
        { method: ['bySortOrder', sortBy, sortOrder] },
        'withItems',
        'withOrders',
      ];
      if (code) scopes.push({ method: ['byCode', code] });
      if (subOrderId) scopes.push({ method: ['byId', subOrderId] });
      const subOrders = await SubOrderModel.scope(scopes).findAll();
      sendSuccess(res, subOrders);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const { subOrderId } = req.params;
      const subOrder = await SubOrderModel.scope([
        { method: ['byId', subOrderId] },
        'withItems',
        'withOrderInfo',
      ]).findOne();
      if (!subOrder) { return sendError(res, 404, NoData); }
      sendSuccess(res, subOrder);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const { subOrderId } = req.params;
      const params = req.parameters.permit(SubOrderModel.UPDATABLE_PARAMETERS).value();
      const subOrder = await SubOrderModel.scope([
        { method: ['byId', subOrderId] },
      ]).findOne();
      if (!subOrder) { return sendError(res, 404, NoData); }
      await subOrder.update(params, { validate: false });
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

  public async approveCancel (req: Request, res: Response) {
    try {
      const subOrder = await SubOrderModel.scope([
        { method: ['byCancelStatus', SubOrderModel.CANCEL_STATUS.PENDING] },
      ]).findByPk(req.params.subOrderId);
      if (!subOrder) return sendError(res, 404, NoData);
      await subOrder.update({ cancelStatus: SubOrderModel.CANCEL_STATUS.APPROVED, status: SubOrderModel.STATUS_ENUM.CANCEL }, { hooks: false, validate: false });
      sendSuccess(res, { subOrder });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async rejectCancel (req: Request, res: Response) {
    try {
      const subOrder = await SubOrderModel.scope([
        { method: ['byCancelStatus', SubOrderModel.CANCEL_STATUS.PENDING] },
      ]).findByPk(req.params.subOrderId);
      if (!subOrder) return sendError(res, 404, NoData);
      await subOrder.update({ cancelStatus: SubOrderModel.CANCEL_STATUS.REJECTED, cancelRejectNote: req.body.cancelRejectNote }, { hooks: false, validate: false });
      sendSuccess(res, { subOrder });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SubOrderController();
