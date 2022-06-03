import OrderDecorator from '@decorators/orders';
import { AddressIsNotValid, NoData, voucherIsCannotApply } from '@libs/errors';
import sequelize from '@initializers/sequelize';
import { sendError, sendSuccess } from '@libs/response';
import MWardModel from '@models/mWards';
import OrderItemModel from '@models/orderItems';
import OrderModel from '@models/orders';
import VoucherModel from '@models/vouchers';
import SubOrderModel from '@models/subOrders';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';
import CartModel from '@models/carts';
import CartItemModel from '@models/cartItems';

class OrderController {
  public async create (req: Request, res: Response) {
    try {
      const { currentUser } = req;
      const params = req.parameters.permit(OrderModel.USER_CREATABLE_PARAMETERS).value();
      let orderParams: any = { };
      let voucher: any = {};
      if (params.appliedVoucherId) {
        voucher = await VoucherModel.scope([
          { method: ['byRecipient', currentUser.id] },
          { method: ['byId', params.appliedVoucherId] },
          { method: ['byVoucherApplication', params.paymentMethod] },
          'isNotUsed',
        ]).findOne();
        if (!voucher) {
          return sendError(res, 404, voucherIsCannotApply);
        }
      }
      const ward = await this.validateAddress(params);
      if (!ward) { return sendError(res, 403, AddressIsNotValid); }
      if (!currentUser) {
        orderParams = {
          ...params,
          ownerId: 1,
          orderableType: OrderModel.ORDERABLE_TYPE.USER,
          creatableType: OrderModel.CREATABLE_TYPE.ADMIN,
          status: params.paymentMethod === OrderModel.PAYMENT_METHOD.COD ? OrderModel.STATUS_ENUM.DRAFT : OrderModel.STATUS_ENUM.PENDING,
        };
      } else {
        orderParams = {
          ...params,
          orderableType: OrderModel.ORDERABLE_TYPE.USER,
          orderableId: currentUser.id,
          ownerId: currentUser.id,
          creatableType: OrderModel.CREATABLE_TYPE.USER,
          status: params.paymentMethod === OrderModel.PAYMENT_METHOD.COD ? OrderModel.STATUS_ENUM.DRAFT : OrderModel.STATUS_ENUM.PENDING,
        };
      }
      const orderFormat: any = await OrderDecorator.formatOrder(orderParams, voucher, ward, currentUser);
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const order = await OrderModel.create(orderFormat, {
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
      if (currentUser) {
        const cart = await CartModel.scope([
          { method: ['byUser', currentUser.id] },
        ]).findOne();
        const warehouseIds = [];
        const productVariantIds = [];
        for (const item of params.subOrders) {
          warehouseIds.push(item.warehouseId);
          productVariantIds.push(item.items.map((record: any) => record.productVariantId));
        }
        await CartItemModel.destroy({ where: { cartId: cart.id, warehouseId: warehouseIds, productVariantId: productVariantIds.flat(Infinity) } });
      }
      sendSuccess(res, { order: result });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async createPayment (req: Request, res: Response) {
    try {
      const order = await OrderModel.scope([
        { method: ['byStatus', OrderModel.STATUS_ENUM.PENDING] },
        { method: ['byOrderAble', req.currentUser.id, 'USER'] },
        { method: ['byPayment', OrderModel.PAYMENT_METHOD.VNPAY] },
        { method: ['byId', req.params.orderId] },
        'isNotPaid',
      ]).findOne();
      if (!order) return sendError(res, 404, NoData);
      order.total = order.subTotal;
      const paymentMethod = await order.getPaymentMethod();
      sendSuccess(res, { order, paymentMethod });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  private async validateAddress (params: any) {
    if (!params.shippingWardId || !params.shippingDistrictId || !params.shippingProvinceId) return false;
    const ward = await MWardModel.scope([
      { method: ['byId', params.shippingWardId] },
      { method: ['byWardAddress', params.shippingDistrictId, params.shippingProvinceId] },
    ]).findOne();
    if (ward) return ward;
    return false;
  }
}

export default new OrderController();
