import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import MProvinceModel from '@models/mProvinces';
import MDistrictModel from '@models/mDistricts';
import MWardModel from '@models/mWards';
import MColorModel from '@models/mColors';
import MSizeModel from '@models/mSizes';
import ProductCategoryModel from '@models/productCategories';

class SelectionController {
  public async productCategories (req: Request, res: Response) {
    try {
      const { type } = req.query;
      const productCategories = await ProductCategoryModel.getHierarchy(type);
      sendSuccess(res, { productCategories });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async districtSelections (req: Request, res: Response) {
    try {
      const districts = await MDistrictModel.scope([{ method: ['byProvince', req.query.provinceId] }]).findAll();
      sendSuccess(res, districts);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async provinceSelections (req: Request, res: Response) {
    try {
      const provinces = await MProvinceModel.findAll();
      sendSuccess(res, provinces);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async wardSelections (req: Request, res: Response) {
    try {
      const wards = await MWardModel.scope([{ method: ['byDistrict', req.query.districtId] }]).findAll();
      sendSuccess(res, wards);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async colorSelections (req: Request, res: Response) {
    try {
      const colors = await MColorModel.findAll();
      sendSuccess(res, colors);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async sizeSelections (req: Request, res: Response) {
    try {
      const { type } = req.query;
      const scopes: any = [];
      if (type) {
        scopes.push({ method: ['byType', type] });
      }
      const sizes = await MSizeModel.scope(scopes).findAll();
      sendSuccess(res, sizes);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SelectionController();
