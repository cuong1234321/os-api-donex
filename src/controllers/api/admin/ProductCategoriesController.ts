import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import { NoData } from '@libs/errors';
import ProductCategoryModel from '@models/productCategories';
import ImageUploaderService from '@services/imageUploader';
import dayjs from 'dayjs';
import XlsxService from '@services/xlsx';

class ProductCategoryController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(ProductCategoryModel.CREATABLE_PARAMETERS).value();
      if (params.parentId) {
        const cateParent = await ProductCategoryModel.findByPk(params.parentId);
        if (!cateParent) { return sendError(res, 404, NoData); }
        params.type = cateParent.type;
      }
      if (params.type === ProductCategoryModel.TYPE_ENUM.PRODUCT_TYPE && !params.parentId) {
        const productType = await ProductCategoryModel.scope([
          { method: ['byType', ProductCategoryModel.TYPE_ENUM.PRODUCT_TYPE] },
          'notChildren',
        ]).findOne();
        params.parentId = productType.id;
      }
      const productCategory = await ProductCategoryModel.create(params);
      sendSuccess(res, { productCategory });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async index (req: Request, res: Response) {
    try {
      const { type } = req.query;
      const productCategories = await ProductCategoryModel.getHierarchy(type);
      sendSuccess(res, { productCategories });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async uploadThumbnail (req: Request, res: Response) {
    try {
      const thumbnail = await ImageUploaderService.singleUpload(req.file);
      const productCategory = await ProductCategoryModel.findByPk(req.params.productCategoryId);
      if (!productCategory) return sendError(res, 404, NoData);
      await productCategory.update({ thumbnail });
      sendSuccess(res, { productCategory });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async show (req: Request, res: Response) {
    try {
      let productCategory = await ProductCategoryModel.findByPk(req.params.productCategoryId);
      if (!productCategory) return sendError(res, 404, NoData);
      const productCategories = await ProductCategoryModel.findAll();
      productCategory = await ProductCategoryModel.getHierarchyByParentNodes([productCategory], productCategories);
      sendSuccess(res, { productCategory });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(ProductCategoryModel.UPDATABLE_PARAMETERS).value();
      const productCategory = await ProductCategoryModel.findByPk(req.params.productCategoryId);
      if (!productCategory) return sendError(res, 404, NoData);
      await productCategory.update(params);
      sendSuccess(res, { productCategory });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const productCategory = await ProductCategoryModel.findByPk(req.params.productCategoryId);
      if (!productCategory) return sendError(res, 404, NoData);
      await productCategory.destroy();
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async download (req: Request, res: Response) {
    try {
      const { type } = req.query;
      const time = dayjs().format('DD-MM-YY-hh:mm:ss');
      const fileName = `Danh-sach-danh-muc-${time}.xlsx`;
      const scopes: any = [];
      if (type) scopes.push({ method: ['byType', type] });
      const categories = await ProductCategoryModel.scope(scopes).findAll();
      const buffer: any = await XlsxService.downloadCategories(categories);
      res.writeHead(200, [
        ['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        ['Content-Disposition', 'attachment; filename=' + `${fileName}`],
      ]);
      res.end(Buffer.from(buffer, 'base64'));
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ProductCategoryController();
