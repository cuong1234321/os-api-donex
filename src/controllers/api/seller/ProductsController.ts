import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import ProductModel from '@models/products';
import settings from '@configs/settings';
import { Sequelize } from 'sequelize';
import CollaboratorModel from '@models/collaborators';
import SaleCampaignModel from '@models/saleCampaigns';
import SaleCampaignProductDecorator from '@decorators/saleCampaignProducts';
import ProductVariantModel from '@models/productVariants';
import { NoData } from '@libs/errors';
import ProductOptionModel from '@models/productOptions';

class ProductController {
  public async index (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller || { type: 'collaborator' };
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (page - 1) * limit;
      const { price, priceOrder } = req.query;
      const scopes = this.listProductQueryBuilder(req);
      let products = await ProductModel.scope(scopes).findAll();
      const saleCampaigns = await this.getSaleCampaigns(currentSeller.type);
      products = await SaleCampaignProductDecorator.calculatorVariantPrice(products, saleCampaigns);
      if (price) {
        products = products.filter((record: any) => record.getDataValue('minPrice') === parseInt(price as string));
      }
      if (priceOrder) {
        products = this.sortProducts(products, priceOrder as string);
      }
      const total = products.length;
      const productRefs = products.splice(offset, limit);
      sendSuccess(res, { products: productRefs, pagination: { total, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async variantIndex (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      const { productId } = req.params;
      let product: any = await ProductModel.findByPk(productId);
      if (!product) { return sendError(res, 404, NoData); }
      const scopes: any = [
        'withOptions',
        'withAboutQuantity',
        { method: ['byProductId', productId] },
      ];
      const variants = await ProductVariantModel.scope(scopes).findAll({
        attributes: {
          exclude: ['buyPrice'],
        },
      });
      product.setDataValue('variants', variants);
      const saleCampaigns = await this.getSaleCampaigns(currentSeller.type);
      product = await SaleCampaignProductDecorator.calculatorVariantPrice([product], saleCampaigns);
      sendSuccess(res, { variants: product[0].getDataValue('variants') });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const currentSeller = req.currentSeller;
      let product: any = await ProductModel.scope([
        { method: ['byId', req.params.productId] },
        'withCollections',
        'withCategories',
        'withProductType',
        'withGender',
        { method: ['byStatus', ProductModel.STATUS_ENUM.ACTIVE] },
      ]).findOne();
      if (!product) {
        return sendError(res, 404, NoData);
      }
      const options = await ProductOptionModel.scope([
        { method: ['byProductId', product.id] },
        'withValueName',
      ]).findAll();
      product.setDataValue('options', options);
      product.setDataValue('medias', await product.getMedias());
      const scopes: any = [
        'withOptions',
        'withAboutQuantity',
        { method: ['byProductId', req.params.productId] },
      ];
      const variants = await ProductVariantModel.scope(scopes).findAll({
        attributes: {
          exclude: ['buyPrice'],
        },
      });
      product.setDataValue('variants', variants);
      const saleCampaigns = await this.getSaleCampaigns(currentSeller.type);
      product = await SaleCampaignProductDecorator.calculatorVariantPrice([product], saleCampaigns);
      sendSuccess(res, { product: product[0] });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  private listProductQueryBuilder (req: Request) {
    const { sku, name, category, collectionId, unit, skuOrder, nameOrder, categoryOrder } = req.query;
    const orderConditions: any = [];
    const scopes: any = [
      'withCollections',
      'withCategories',
      'withVariants',
      'withPriceRange',
      { method: ['byStatus', ProductModel.STATUS_ENUM.ACTIVE] },
    ];
    if (sku) scopes.push({ method: ['bySkuCodeName', sku] });
    if (name) scopes.push({ method: ['byName', name] });
    if (category) { scopes.push({ method: ['byCategoryName', category] }); }
    if (collectionId) scopes.push({ method: ['byCollectionId', collectionId] });
    if (unit) scopes.push({ method: ['byUnit', unit] });
    if (skuOrder) orderConditions.push([Sequelize.literal('skuCode'), skuOrder]);
    if (nameOrder) orderConditions.push([Sequelize.literal('name'), nameOrder]);
    if (categoryOrder) orderConditions.push([Sequelize.literal('category'), categoryOrder]);
    scopes.push({ method: ['bySortOrder', orderConditions] });
    return scopes;
  }

  private sortProducts (products: any, sortOrder: string) {
    if (sortOrder === 'ASC') {
      products = products.sort((a: any, b: any) => {
        return a.getDataValue('minPrice') - b.getDataValue('minPrice');
      });
    } else if (sortOrder === 'DESC') {
      products = products.sort((a: any, b: any) => {
        return b.getDataValue('minPrice') - a.getDataValue('minPrice');
      });
    }
    return products;
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
