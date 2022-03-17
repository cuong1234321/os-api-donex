import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import ProductModel from '@models/products';
import sequelize from '@initializers/sequelize';
import { Transaction } from 'sequelize/types';
import ProductOptionModel from '@models/productOptions';
import ProductCategoryRefModel from '@models/productCategoryRefs';
import ProductVariantModel from '@models/productVariants';
import { FileIsNotSupport, NoData } from '@libs/errors';
import ImageUploaderService from '@services/imageUploader';
import settings from '@configs/settings';
import VideoUploaderService from '@services/videoUploader';
import ProductMediaModel from '@models/productMedias';
import { Sequelize } from 'sequelize';

class ProductController {
  public async index (req: Request, res: Response) {
    try {
      const page = req.query.page as string || '1';
      const limit = parseInt(req.query.size as string) || parseInt(settings.defaultPerPage);
      const offset = (parseInt(page, 10) - 1) * limit;
      const scopes = this.listProductQueryBuilder(req);
      const { count, rows } = await ProductModel.scope(scopes).findAndCountAll({ limit, offset, distinct: true, col: 'ProductModel.id' });
      sendSuccess(res, { products: rows, pagination: { total: count, page, perPage: limit } });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(ProductModel.CREATABLE_PARAMETERS).value();
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const product = await ProductModel.create(params, {
          include: [
            { model: ProductCategoryRefModel, as: 'categoryRefs' },
            { model: ProductOptionModel, as: 'options' },
            { model: ProductVariantModel, as: 'variants' },
            { model: ProductMediaModel, as: 'medias' },
          ],
          transaction,
        });
        await product.updateVariationOptions(transaction);
        return product;
      });
      sendSuccess(res, { product: result });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadMedia (req: Request, res: Response) {
    try {
      const product = await ProductModel.findByPk(req.params.productId);
      if (!product) return sendError(res, 404, NoData);
      const files: any[] = req.files as any[];
      for (const file of files) {
        const attribute: any = {};
        if (file.mimetype.split('/')[0] === settings.prefix.imageMime) {
          attribute.source = await ImageUploaderService.singleUpload(file);
          attribute.type = ProductMediaModel.TYPE_ENUM.IMAGE;
        } else if (file.mimetype.split('/')[0] === settings.prefix.videoMime) {
          attribute.source = await VideoUploaderService.singleUpload(file);
          attribute.type = ProductMediaModel.TYPE_ENUM.VIDEO;
        } else {
          return sendError(res, 403, FileIsNotSupport);
        }
        await ProductMediaModel.update(attribute, { where: { productId: product.id, id: file.fieldname } });
      }
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadOptionMedia (req: Request, res: Response) {
    try {
      const files: any[] = req.files as any[];
      const option = await ProductOptionModel.scope([
        { method: ['byProductId', req.params.productId] },
        { method: ['byKey', ProductOptionModel.TYPE_ENUM.color] },
      ]).findOne();
      if (!option) return sendError(res, 404, NoData);
      for (const file of files) {
        const attribute: any = {};
        attribute.thumbnail = await ImageUploaderService.singleUpload(file);
        await ProductOptionModel.update(attribute, { where: { id: file.fieldname } });
      }
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async active (req: Request, res: Response) {
    try {
      const product = await ProductModel.scope([
        { method: ['byId', req.params.productId] },
        'isNotActive',
      ]).findOne();
      if (!product) {
        return sendError(res, 404, NoData);
      }
      await product.update({ status: ProductModel.STATUS_ENUM.ACTIVE });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      const product = await ProductModel.scope([
        { method: ['byId', req.params.productId] },
        'withCollections',
        'withCategories',
        'withProductType',
        'withGender',
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
      product.setDataValue('variants', await product.getVariantDetail());
      sendSuccess(res, { product });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async inActive (req: Request, res: Response) {
    try {
      const product = await ProductModel.scope([
        { method: ['byId', req.params.productId] },
        'isActive',
      ]).findOne();
      if (!product) {
        return sendError(res, 404, NoData);
      }
      await product.update({ status: ProductModel.STATUS_ENUM.INACTIVE });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const product = await ProductModel.findByPk(req.params.productId);
      if (!product) {
        return sendError(res, 404, NoData);
      }
      await product.destroy();
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  private listProductQueryBuilder (req: Request) {
    const { sku, name, category, collectionId, unit, status, price, skuOrder, nameOrder, categoryOrder, priceOrder, statusOrder } = req.query;
    const orderConditions: any = [];
    const scopes: any = [
      'withCollections',
      'withCategories',
    ];
    if (sku) scopes.push({ method: ['bySkuCodeName', sku] });
    if (name) scopes.push({ method: ['byName', name] });
    if (category) { scopes.push({ method: ['byCategoryName', category] }); }
    if (collectionId) scopes.push({ method: ['byCollectionId', collectionId] });
    if (unit) scopes.push({ method: ['byUnit', unit] });
    if (price) scopes.push({ method: ['byPrice', parseInt(price as string)] });
    if (status) scopes.push({ method: ['byStatus', status] });
    if (skuOrder) orderConditions.push([Sequelize.literal('skuCode'), skuOrder]);
    if (nameOrder) orderConditions.push([Sequelize.literal('name'), nameOrder]);
    if (categoryOrder) orderConditions.push([Sequelize.literal('category'), categoryOrder]);
    if (priceOrder) orderConditions.push([Sequelize.literal('price'), priceOrder]);
    if (statusOrder) orderConditions.push([Sequelize.literal('status'), statusOrder]);
    scopes.push({ method: ['bySortOrder', orderConditions] });
    return scopes;
  }
}

export default new ProductController();
