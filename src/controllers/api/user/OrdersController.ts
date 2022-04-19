import sequelize from '@initializers/sequelize';
import { sendError, sendSuccess } from '@libs/response';
import OrderItemModel from '@models/orderItems';
import OrderModel from '@models/orders';
import SubOrderModel from '@models/subOrders';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';

class OrderController {
  public async create (req: Request, res: Response) {
    try {
      const { currentUser } = req;
      const params = req.parameters.permit(OrderModel.USER_CREATABLE_PARAMETERS).value();
      params.ownerId = currentUser.id;
      console.log(dayjs('2000').startOf('year').format());

      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const order = await OrderModel.create({
          ...params,
          creatableType: OrderModel.CREATABLE_TYPE.USER,
          creatableId: currentUser.id,
          orderableType: OrderModel.ORDERABLE_TYPE.USER,
          orderableId: currentUser.id,
          ownerId: currentUser.id,
        }, {
          include: [
            {
              model: SubOrderModel,
              as: 'subOrders',
              include: [{ model: OrderItemModel, as: 'items' }],
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
