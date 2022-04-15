import { sendError, sendSuccess } from '@libs/response';
import BillTemplateModel from '@models/billTemplates';
import { Request, Response } from 'express';

class BillTemplateController {
  public async show (req: Request, res: Response) {
    try {
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
      sendSuccess(res, billTemplate);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(BillTemplateModel.CREATABLE_PARAMETERS).value();
      await BillTemplateModel.update(
        { status: BillTemplateModel.STATUS_ENUM.INACTIVE },
        {
          where: {
            status: BillTemplateModel.STATUS_ENUM.ACTIVE,
          },
        },
      );
      const billTemplate = await BillTemplateModel.create(params);
      sendSuccess(res, billTemplate);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
};
export default new BillTemplateController();
