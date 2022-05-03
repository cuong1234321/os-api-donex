import sequelize from '@initializers/sequelize';
import { sendError, sendSuccess } from '@libs/response';
import MDistrictModel from '@models/mDistricts';
import MProvinceModel from '@models/mProvinces';
import MWardModel from '@models/mWards';
import OrderItemModel from '@models/orderItems';
import OrderModel from '@models/orders';
import SubOrderModel from '@models/subOrders';
import { Request, Response } from 'express';
import { Transaction } from 'sequelize/types';

class OrderController {
  public async create (req: Request, res: Response) {
    try {
      const { currentUser } = req;
      const params = req.parameters.permit(OrderModel.USER_CREATABLE_PARAMETERS).value();
      params.ownerId = currentUser.id;
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const order = await OrderModel.create({
          ...params,
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

  public async show (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(OrderModel.USER_CREATABLE_PARAMETERS).value();
      const subOrders = await OrderModel.formatViewOrder(params.subOrders);
      const province = await MProvinceModel.scope([
        { method: ['byMisaCode', params.shippingProvinceId] },
      ]).findOne();
      const district = await MDistrictModel.scope([
        { method: ['byMisaCode', params.shippingDistrictId] },
      ]).findOne();
      const ward = await MWardModel.scope([
        { method: ['byMisaCode', params.shippingWardId] },
      ]).findOne();
      const order: any = {
        provinceName: province ? province.title : '',
        districtName: district ? district.title : '',
        wardName: ward ? ward.title : '',
        shippingProvinceId: params.shippingProvinceId || '',
        shippingDistrictId: params.shippingProvinceId || '',
        shippingWardId: params.shippingWardId || '',
        shippingAddress: params.shippingAddress || '',
        shippingPhoneNumber: params.shippingPhoneNumber || '',
        shippingFullName: params.shippingFullName || '',
        paymentMethod: params.paymentMethod || 'COD',
        total: 0,
        coinUsed: 0,
        shippingDiscount: 0,
        shippingFee: 0,
        subTotal: 0,
        saleChannel: OrderModel.SALE_CHANNEL.RETAIL,
        code: await OrderModel.generateOderCode(),
        subOrders: subOrders,
      };
      sendSuccess(res, { order });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new OrderController();
