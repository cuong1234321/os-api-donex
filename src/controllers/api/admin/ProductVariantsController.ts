import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import ProductVariantModel from '@models/productVariants';
import SaleCampaignProductModel from '@models/saleCampaignProducts';
import { Op } from 'sequelize';
import SaleCampaignModel from '@models/saleCampaigns';

class ProductVariantController {
  public async index (req: Request, res: Response) {
    try {
      const { category, productId, appliedAt, appliedTo, beneficiaries, warehouseId } = req.query;
      let backlistVariants: any = [];
      const scopes: any = [
        'withOptions',
      ];
      if (category) scopes.push({ method: ['byCategory', (category as string).split(',')] });
      if (productId) scopes.push({ method: ['byProduct', (productId as string).split(',')] });
      if (productId) scopes.push({ method: ['byProduct', (productId as string).split(',')] });
      if (warehouseId) scopes.push({ method: ['byWarehouse', warehouseId] });
      if (appliedAt && appliedTo && beneficiaries) {
        const saleCampaignScopes: any = [
          'withSaleCampaignActiveSameTime',
        ];
        const beneficiaryType = (beneficiaries as string).split(',');
        const conditions: any = [];
        if (beneficiaryType.includes('distributor')) { conditions.push({ isApplyToDistributor: true }); }
        if (beneficiaryType.includes('agency')) { conditions.push({ isApplyToAgency: true }); }
        if (beneficiaryType.includes('collaborator')) { conditions.push({ isApplyToCollaborator: true }); }
        if (beneficiaryType.includes('user')) { conditions.push({ isApplyToUser: true }); }
        const productVariants = await SaleCampaignProductModel.scope(saleCampaignScopes).findAll({
          include: [
            {
              model: SaleCampaignModel,
              as: 'saleCampaign',
              required: true,
              where: {
                [Op.or]: conditions,
              },
            },
          ],
        });
        backlistVariants = productVariants.map((record: any) => record.productVariantId);
      }
      scopes.push({ method: ['byIgnoreIds', backlistVariants] });
      const variants = await ProductVariantModel.scope(scopes).findAll();
      sendSuccess(res, variants);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ProductVariantController();
