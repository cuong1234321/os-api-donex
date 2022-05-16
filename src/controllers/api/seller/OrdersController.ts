import ApplySaleCampaignVariantDecorator from '@decorators/applySaleCampaignVariants';
import sequelize from '@initializers/sequelize';
import { sendError, sendSuccess } from '@libs/response';
import BillTemplateModel from '@models/billTemplates';
import OrderItemModel from '@models/orderItems';
import OrderModel from '@models/orders';
import SubOrderModel from '@models/subOrders';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';

class OrderController {
  public async create (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const params = req.parameters.permit(OrderModel.SELLER_CREATABLE_PARAMETERS).value();
      let total = 0;
      let subTotal = 0;
      let shippingFee = 0;
      const billTemplate = (await BillTemplateModel.findOrCreate({
        where: {
          status: BillTemplateModel.STATUS_ENUM.ACTIVE,
        },
        defaults: {
          id: undefined,
          title: 'Hóa đơn thanh toán',
          content: '',
          status: BillTemplateModel.STATUS_ENUM.ACTIVE,
        },
      }))[0];
      for (const subOrder of params.subOrders) {
        const { items, totalPrice, totalQuantity } = await ApplySaleCampaignVariantDecorator.calculatorVariantPrice(subOrder.items, params.saleCampaignId);
        subOrder.items = items;
        subOrder.status = SubOrderModel.STATUS_ENUM.PENDING;
        subOrder.subTotal = totalPrice;
        subOrder.total = totalQuantity;
        subOrder.billId = billTemplate.id;
        subTotal += totalPrice;
        total += totalQuantity;
        shippingFee += subOrder.shippingFee;
      }
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const order = await OrderModel.create({
          ...params,
          orderableType: currentSeller.type,
          orderableId: currentSeller.id,
          ownerId: currentSeller.id,
          total,
          subTotal,
          shippingFee,
        }, {
          include: [
            {
              model: SubOrderModel,
              as: 'subOrders',
              include: [
                {
                  model: OrderItemModel,
                  as: 'items',
                },
              ],
              transaction,
            },
          ],
          transaction,
        });
        return order;
      });
      sendSuccess(res, { order: result });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new OrderController();
