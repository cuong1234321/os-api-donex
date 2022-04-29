import ApplySaleCampaignVariantDecorator from '@decorators/applySaleCampaignVariants';
import sequelize from '@initializers/sequelize';
import { sendError, sendSuccess } from '@libs/response';
import OrderItemModel from '@models/orderItems';
import OrderModel from '@models/orders';
import SubOrderModel from '@models/subOrders';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';

class OrderController {
  public async create (req: Request, res: Response) {
    try {
      const currentAdmin = req.currentAdmin || { id: 1 };
      const params = req.parameters.permit(OrderModel.ADMIN_CREATABLE_PARAMETERS).value();
      params.ownerId = currentAdmin.id;
      let total = 0;
      let subTotal = 0;
      let shippingFee = 0;
      for (const subOrder of params.subOrders) {
        const { items, totalPrice, totalQuantity } = await ApplySaleCampaignVariantDecorator.calculatorVariantPrice(subOrder.items, params.orderableType);
        subOrder.items = items;
        subOrder.subTotal = totalPrice;
        subOrder.total = totalQuantity;
        subTotal += totalPrice;
        total += totalQuantity;
        shippingFee += subOrder.shippingFee;
      }
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const order = await OrderModel.create({
          ...params,
          creatableType: OrderModel.CREATABLE_TYPE.ADMIN,
          creatableId: currentAdmin.id,
          ownerId: currentAdmin.id,
          total,
          subTotal,
          shippingFee,
          paymentMethod: OrderModel.PAYMENT_METHOD.COD,
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
