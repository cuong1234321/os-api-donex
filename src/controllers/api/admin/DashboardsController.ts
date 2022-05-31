import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import UserModel from '@models/users';
import AdminModel from '@models/admins';
import CollaboratorModel from '@models/collaborators';
import dayjs from 'dayjs';
import SubOrderModel from '@models/subOrders';
import OrderModel from '@models/orders';
import _ from 'lodash';

class DashboardController {
  public async userIndex (req: Request, res: Response) {
    try {
      const totalUser = await UserModel.count();
      const totalActiveUser = await UserModel.count({
        where: {
          status: UserModel.STATUS_ENUM.ACTIVE,
        },
      });
      const totalInactiveUser = await UserModel.count({
        where: {
          status: UserModel.STATUS_ENUM.INACTIVE,
        },
      });
      const user = {
        totalUser,
        totalActiveUser,
        totalInactiveUser,
      };
      const totalAdmin = await AdminModel.count();
      const totalActiveAdmin = await AdminModel.count({
        where: {
          status: AdminModel.STATUS_ENUM.ACTIVE,
        },
      });
      const totalInactiveAdmin = await AdminModel.count({
        where: {
          status: AdminModel.STATUS_ENUM.INACTIVE,
        },
      });
      const admin = {
        totalAdmin,
        totalActiveAdmin,
        totalInactiveAdmin,
      };
      const totalSeller = await CollaboratorModel.count();
      const totalActiveSeller = await CollaboratorModel.count({
        where: {
          status: CollaboratorModel.STATUS_ENUM.ACTIVE,
        },
      });
      const totalInactiveSeller = await CollaboratorModel.count({
        where: {
          status: CollaboratorModel.STATUS_ENUM.INACTIVE,
        },
      });
      const totalPendingSeller = await CollaboratorModel.count({
        where: {
          status: CollaboratorModel.STATUS_ENUM.PENDING,
        },
      });
      const totalRejectSeller = await CollaboratorModel.count({
        where: {
          status: CollaboratorModel.STATUS_ENUM.REJECTED,
        },
      });
      const seller = {
        totalSeller,
        totalActiveSeller,
        totalInactiveSeller,
        totalPendingSeller,
        totalRejectSeller,
      };
      sendSuccess(res, { user, admin, seller });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async income (req: Request, res: Response) {
    try {
      const { orderableType } = req.query;
      const daily: any = [];
      const index = orderableType ? 6 : 14;
      for (let i = index; i >= 0; i--) {
        daily.push({
          from: dayjs().subtract(i, 'day').startOf('day').format(),
          to: dayjs().subtract(i, 'day').endOf('day').format(),
        });
      }
      const scopes: any = [
        { method: ['byStatus', SubOrderModel.STATUS_ENUM.DELIVERED] },
        'totalListedPrice',
        'totalSaleCampaignDiscount',
      ];
      if (orderableType === 'user') scopes.push({ method: ['byOrderAbleType', OrderModel.ORDERABLE_TYPE.USER] });
      if (orderableType === 'seller') scopes.push({ method: ['byOrderAbleType', [OrderModel.ORDERABLE_TYPE.COLLABORATOR, OrderModel.ORDERABLE_TYPE.DISTRIBUTOR, OrderModel.ORDERABLE_TYPE.AGENCY]] });
      const subOrders = await SubOrderModel.scope(scopes).findAll();
      const totalOrder = subOrders.length;
      const totalPrice = _.sumBy(subOrders, (subOrder: any) => subOrder.getDataValue('totalListedPrice'));
      const totalDiscount = _.sumBy(subOrders, (subOrder: any) => subOrder.getDataValue('totalSaleCampaignDiscount') + subOrder.getDataValue('rankDiscount') + subOrder.getDataValue('voucherDiscount'));
      scopes.push({ method: ['byDate', dayjs().subtract(index, 'day').format(), dayjs().format()] });
      const subOrderByRangeDates = await SubOrderModel.scope(scopes).findAll();
      const incomes: any = [];
      for (const record of daily) {
        const subOrderByDates = subOrderByRangeDates.filter((subOrder: any) => dayjs(subOrder.createdAt) > dayjs(record.from) && dayjs(subOrder.createdAt) < dayjs(record.to));
        const totalPrice = _.sumBy(subOrderByDates, (subOrder: any) => subOrder.getDataValue('totalListedPrice'));
        const totalDiscount = _.sumBy(subOrderByDates, (subOrder: any) => subOrder.getDataValue('totalSaleCampaignDiscount') + subOrder.getDataValue('rankDiscount') + subOrder.getDataValue('voucherDiscount'));
        incomes.push({
          totalOrder: subOrderByDates.length,
          totalPrice,
          totalDiscount,
          day: dayjs(record.from).format('DD/MM/YYYY'),
        });
      }
      sendSuccess(res, { totalOrder, totalPrice, totalDiscount, incomeDetail: incomes });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async statistical (req: Request, res: Response) {
    try {
      const daily: any = [];
      for (let i = 6; i >= 0; i--) {
        daily.push({
          from: dayjs().subtract(i, 'day').startOf('day').format(),
          to: dayjs().subtract(i, 'day').endOf('day').format(),
        });
      }
      const statistical: any = [];
      const subOrders = await SubOrderModel.scope([
        'isNotDraft',
      ]).findAll();
      const totalOrder = subOrders.length;
      const totalQuantity = _.sumBy(subOrders, (subOrder: any) => subOrder.getDataValue('total'));
      daily.forEach((record: any) => {
        const subOrderByDates = subOrders.filter((subOrder: any) => dayjs(subOrder.createdAt) > dayjs(record.from) && dayjs(subOrder.createdAt) < dayjs(record.to));
        statistical.push({
          totalOrder: subOrderByDates.length,
          totalQuantity: _.sumBy(subOrderByDates, (subOrder: any) => subOrder.getDataValue('total')),
          day: dayjs(record.from).format('DD/MM/YYYY'),
        });
      });
      sendSuccess(res, { totalOrder, totalQuantity, statistical });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}
export default new DashboardController();
