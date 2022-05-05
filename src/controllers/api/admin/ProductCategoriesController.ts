import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import { NoData } from '@libs/errors';
import ProductCategoryModel from '@models/productCategories';
import ImageUploaderService from '@services/imageUploader';

class ProductCategoryController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(ProductCategoryModel.CREATABLE_PARAMETERS).value();
      if (params.parentId) {
        const cateParent = await ProductCategoryModel.findByPk(params.parentId);
        if (!cateParent) { return sendError(res, 404, NoData); }
        params.type = cateParent.type;
      } else {
        params.type = ProductCategoryModel.TYPE_ENUM.NONE;
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
}

export default new ProductCategoryController();
