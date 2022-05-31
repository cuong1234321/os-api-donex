import OrderDecorator from '@decorators/orders';
import { NoData, voucherIsCannotApply } from '@libs/errors';
import sequelize from '@initializers/sequelize';
import { sendError, sendSuccess } from '@libs/response';
import MDistrictModel from '@models/mDistricts';
import MProvinceModel from '@models/mProvinces';
import MWardModel from '@models/mWards';
import OrderItemModel from '@models/orderItems';
import OrderModel from '@models/orders';
import VoucherModel from '@models/vouchers';
import SubOrderModel from '@models/subOrders';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';

class OrderController {
  public async create (req: Request, res: Response) {
    try {
      const { currentUser } = req;
      const params = req.parameters.permit(OrderModel.USER_CREATABLE_PARAMETERS).value();
      let orderParams: any = { };
      let promoApplication: any = {};
      if (params.appliedVoucherId) {
        const voucher = await VoucherModel.scope([
          { method: ['byRecipient', currentUser.id] },
          { method: ['byId', params.appliedVoucherId] },
          { method: ['byVoucherApplication', params.paymentMethod] },
          'isNotUsed',
        ]).findOne();
        if (!voucher) {
          return sendError(res, 404, voucherIsCannotApply);
        }
        promoApplication = voucher;
      }
      if (currentUser) {
        orderParams = {
          ...params,
          orderableType: OrderModel.ORDERABLE_TYPE.USER,
          orderableId: currentUser.id,
          ownerId: currentUser.id,
          creatableType: OrderModel.CREATABLE_TYPE.USER,
          status: params.paymentMethod === OrderModel.PAYMENT_METHOD.COD ? OrderModel.STATUS_ENUM.DRAFT : OrderModel.STATUS_ENUM.PENDING,
        };
      } else {
        orderParams = {
          ...params,
          orderableType: OrderModel.ORDERABLE_TYPE.USER,
          creatableType: OrderModel.CREATABLE_TYPE.ADMIN,
        };
      }
      const orderFormat: any = await OrderDecorator.formatOrder(orderParams, promoApplication);
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const order = await OrderModel.create(orderFormat.order, {
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

  public async show (req: Request, res: Response) {
    try {
      const { currentUser } = req;
      const params = req.parameters.permit(OrderModel.USER_CREATABLE_PARAMETERS).value();
      let promoApplication: any = {};
      if (params.appliedVoucherId) {
        const voucher = await VoucherModel.scope([
          { method: ['byId', params.appliedVoucherId] },
          { method: ['byVoucherApplication', params.paymentMethod] },
        ]).findOne();
        if (!voucher) {
          return sendError(res, 404, voucherIsCannotApply);
        }
        promoApplication = voucher;
      }
      if (currentUser) params.orderableId = currentUser.id;
      const orderFormat: any = await OrderDecorator.formatOrder(params, promoApplication);
      const province = await MProvinceModel.scope([
        { method: ['byId', params.shippingProvinceId] },
      ]).findOne();
      const district = await MDistrictModel.scope([
        { method: ['byId', params.shippingDistrictId] },
      ]).findOne();
      const ward = await MWardModel.scope([
        { method: ['byId', params.shippingWardId] },
      ]).findOne();
      const order: any = {
        provinceName: province ? province.title : '',
        districtName: district ? district.title : '',
        wardName: ward ? ward.title : '',
        shippingProvinceId: params.shippingProvinceId || '',
        shippingDistrictId: params.shippingDistrictId || '',
        shippingWardId: params.shippingWardId || '',
        shippingAddress: params.shippingAddress || '',
        shippingPhoneNumber: params.shippingPhoneNumber || '',
        shippingFullName: params.shippingFullName || '',
        paymentMethod: params.paymentMethod || 'COD',
        total: orderFormat.order.total,
        coinUsed: orderFormat.order.coinUsed,
        shippingDiscount: 0,
        shippingFee: 0,
        subTotal: orderFormat.order.subTotal,
        saleChannel: OrderModel.SALE_CHANNEL.RETAIL,
        code: await OrderModel.generateOderCode(),
        rankDiscount: orderFormat.order.rankDiscount,
        subOrders: orderFormat.order.subOrders,
      };
      sendSuccess(res, { order });
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
      ]).findByPk(req.params.orderId);
      if (!order) return sendError(res, 404, NoData);
      order.total = order.subTotal;
      const paymentMethod = await order.getPaymentMethod();
      sendSuccess(res, { order, paymentMethod });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new OrderController();
