import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import ProductVariantModel from '@models/productVariants';
import SaleCampaignProductModel from '@models/saleCampaignProducts';
import { Op } from 'sequelize';
import SaleCampaignModel from '@models/saleCampaigns';
import { NoData } from '@libs/errors';
import OrderItemModel from '@models/orderItems';
import settings from '@configs/settings';

class ProductVariantController {
  public async index (req: Request, res: Response) {
    try {
      const { category, productId, appliedAt, appliedTo, beneficiaries, warehouseId, sku, name, saleCampaignId } = req.query;
      let backlistVariants: any = [];
      const scopes: any = [
        'withListOptions',
        'withOptions',
        'withUnit',
        'withWarehouseVariant',
      ];
      if (category) scopes.push({ method: ['byCategory', (category as string).split(',')] });
      if (productId) scopes.push({ method: ['byProduct', (productId as string).split(',')] });
      if (warehouseId) scopes.push({ method: ['byWarehouse', warehouseId] });
      if (sku) scopes.push({ method: ['bySkuCode', sku] });
      if (name) scopes.push({ method: ['byName', name] });
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
      let variants = await ProductVariantModel.scope(scopes).findAll();
      if (saleCampaignId) {
        const saleCampaign = await SaleCampaignModel.scope([
          'isAbleToUse',
          'withProductVariant',
          { method: ['byId', saleCampaignId] },
        ]).findOne();
        if (!saleCampaign) { return sendError(res, 404, NoData); }
        variants = await this.calculatorSaleCampaignPrice(variants, saleCampaign);
      }
      sendSuccess(res, variants);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async report (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const { freeWord, fromDate, toDate } = req.query;
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        { method: ['bySortOrder', sortBy, sortOrder] },
        'withBuyerName',
        'withProductUnit',
        'withSubOrderFinish',
      ];
      if (freeWord) { scopes.push({ method: ['byFreeWord', freeWord] }); }
      if (fromDate && toDate) { scopes.push({ method: ['byCreatedAt', fromDate, toDate] }); }
      const { rows, count } = await OrderItemModel.scope(scopes).findAndCountAll({ limit, offset });
      sendSuccess(res, { rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  private async calculatorSaleCampaignPrice (variants: any, saleCampaign: any) {
    variants.forEach((variant: any) => {
      if (saleCampaign.productVariants.find((record: any) => record.productVariantId === variant.id)) {
        if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.REDUCE_BY_AMOUNT) {
          variant.setDataValue('saleCampaignPrice', variant.sellPrice - saleCampaign.value);
        }
        if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.INCREASE_BY_AMOUNT) {
          variant.setDataValue('saleCampaignPrice', variant.sellPrice + saleCampaign.value);
        }
        if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.REDUCE_BY_PERCENT) {
          variant.setDataValue('saleCampaignPrice', variant.sellPrice - (variant.sellPrice * saleCampaign.value / 100));
        }
        if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.INCREASE_BY_PERCENT) {
          variant.setDataValue('saleCampaignPrice', variant.sellPrice + (variant.sellPrice * saleCampaign.value / 100));
        }
      } else {
        variant.setDataValue('saleCampaignPrice', variant.sellPrice);
      }
    });
    return variants;
  }
}

export default new ProductVariantController();
