import { sendError, sendSuccess } from '@libs/response';
import { Request, Response } from 'express';
import Settings from '@configs/settings';
import ProductModel from '@models/products';
import { Sequelize } from 'sequelize';
import ProductCategoryModel from '@models/productCategories';
import ProductOptionModel from '@models/productOptions';
import { NoData } from '@libs/errors';
import SaleCampaignProductDecorator from '@decorators/saleCampaignProducts';
import SaleCampaignModel from '@models/saleCampaigns';
import CollaboratorModel from '@models/collaborators';
class ProductController {
  public async index (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const { categoryIds, genderIds, productTypeIds, collectionIds, priceFrom, priceTo, createdAtOrder, price, freeWord, colorIds, sizeIds, rating, warehouseId, flashSale } = req.query;
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(Settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const orderConditions: any = [];
      const scopes: any = [
        'isActive',
        'withThumbnail',
        'withVariants',
        'withAverageRating',
        'withSellQuantity',
      ];
      if (categoryIds) {
        const listCategoryId = await ProductCategoryModel.getCategoryIdsByParentId((categoryIds as string).split(','));
        scopes.push({ method: ['byCategory', listCategoryId] });
      }
      if (collectionIds) scopes.push({ method: ['byCollectionId', (collectionIds as string).split(',')] });
      if (genderIds) scopes.push({ method: ['byGenderId', (genderIds as string).split(',')] });
      if (productTypeIds) scopes.push({ method: ['byProductTypeId', (productTypeIds as string).split(',')] });
      if (priceFrom || priceTo) scopes.push({ method: ['byPriceRange', priceFrom, priceTo] });
      if (freeWord) scopes.push({ method: ['byFreeWord', freeWord] });
      if (colorIds) scopes.push({ method: ['byColor', (colorIds as string).split(',')] });
      if (sizeIds) scopes.push({ method: ['bySize', (sizeIds as string).split(',')] });
      if (currentUser) scopes.push({ method: ['isFavorite', currentUser.id] });
      if (price) orderConditions.push([Sequelize.literal('price'), price]);
      if (createdAtOrder) orderConditions.push([Sequelize.literal('createdAt'), createdAtOrder]);
      if (rating) { scopes.push({ method: ['byRating', rating] }); }
      if (warehouseId) { scopes.push({ method: ['byWarehouseId', warehouseId] }); }
      if (flashSale === 'true') { scopes.push('isFlashSale'); }
      scopes.push({ method: ['bySorting', orderConditions] });
      const { count, rows } = await ProductModel.scope(scopes).findAndCountAll({
        limit,
        offset,
        distinct: true,
        col: 'ProductModel.id',
      });
      const saleCampaigns = await this.getSaleCampaigns('USER');
      const products = await SaleCampaignProductDecorator.calculatorVariantPrice(rows, saleCampaigns);
      sendSuccess(res, { products, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const currentUser = req.currentUser;
      const scopes: any = [
        { method: ['byId', req.params.productId] },
        'withCollections',
        'withCategories',
        'withProductType',
        'withGender',
        'withPriceRange',
        'isActive',
        'withAverageRating',
        'withRatingSummary',
      ];
      if (currentUser) scopes.push({ method: ['isFavorite', currentUser.id] });
      let product: any = await ProductModel.scope(scopes).findOne();
      if (!product) {
        return sendError(res, 404, NoData);
      }
      const options = await ProductOptionModel.scope([
        { method: ['byProductId', product.id] },
        'withValueName',
      ]).findAll();
      product.setDataValue('options', options);
      product.setDataValue('medias', await product.getMedias());
      product.setDataValue('variants', await product.getVariantDetail());
      const saleCampaigns = await this.getSaleCampaigns('USER');
      product = await SaleCampaignProductDecorator.calculatorVariantPrice([product], saleCampaigns);
      sendSuccess(res, { product: product[0] });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async verifyProduct (req: Request, res: Response) {
    try {
      const { sku } = req.query;
      let product: any = await ProductModel.scope([
        { method: ['verifyProduct', sku] },
        'isActive',
        'withThumbnail',
        'withPrice',
        'withVariants',
      ]).findOne();
      if (!product) { return sendError(res, 404, NoData); }
      const saleCampaigns = await this.getSaleCampaigns('USER');
      product = (await SaleCampaignProductDecorator.calculatorVariantPrice([product], saleCampaigns))[0];
      sendSuccess(res, product);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  private async getSaleCampaigns (userType: string) {
    const scopes: any = [
      'isAbleToUse',
      'withProductVariant',
    ];
    switch (userType) {
      case CollaboratorModel.TYPE_ENUM.DISTRIBUTOR:
        scopes.push('isApplyToDistributor');
        break;
      case CollaboratorModel.TYPE_ENUM.AGENCY:
        scopes.push('isApplyToAgency');
        break;
      case CollaboratorModel.TYPE_ENUM.COLLABORATOR:
        scopes.push('isApplyToCollaborator');
        break;
      case 'USER':
        scopes.push('isApplyToUser');
        break;
      default:
        break;
    }
    const saleCampaigns = await SaleCampaignModel.scope(scopes).findAll();
    return saleCampaigns;
  }
}

export default new ProductController();
