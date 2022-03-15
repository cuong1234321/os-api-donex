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

class ProductController {
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
}

export default new ProductController();
