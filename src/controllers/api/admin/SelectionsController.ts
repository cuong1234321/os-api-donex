import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import MProvinceModel from '@models/mProvinces';
import MDistrictModel from '@models/mDistricts';
import MWardModel from '@models/mWards';
import MColorModel from '@models/mColors';
import MSizeModel from '@models/mSizes';
import ProductCategoryModel from '@models/productCategories';
import NewsCategoryModel from '@models/newsCategories';
import UserModel from '@models/users';
import CollaboratorModel from '@models/collaborators';
import WarehouseModel from '@models/warehouses';
import MBillTemplateKeyModel from '@models/mBillTemplateKeys';
import ProductModel from '@models/products';
import SaleCampaignModel from '@models/saleCampaigns';
import { NoData } from '@libs/errors';
import SaleCampaignProductDecorator from '@decorators/saleCampaignProducts';
import AddressBookModel from '@models/addressBooks';

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
      const { misaCodeProvince, provinceId } = req.query;
      const provinceIds: any = [];
      if (misaCodeProvince) {
        const province = await MProvinceModel.scope([{ method: ['byMisaCode', misaCodeProvince] }]).findOne();
        provinceIds.push(province.id);
      }
      if (provinceId) provinceIds.push(provinceId);
      const districts = await MDistrictModel.scope([{ method: ['byProvince', provinceIds] }]).findAll();
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
      const { misaCodeDistrict, districtId } = req.query;
      const districtIds: any = [];
      if (misaCodeDistrict) {
        const district = await MDistrictModel.scope([{ method: ['byMisaCode', misaCodeDistrict] }]).findOne();
        districtIds.push(district.id);
      }
      if (districtId) districtIds.push(districtId);
      const wards = await MWardModel.scope([{ method: ['byDistrict', districtIds] }]).findAll();
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

  public async newsCategorySelections (req: Request, res: Response) {
    try {
      const { freeWord } = req.query;
      const newsCategories = await NewsCategoryModel.scope([
        { method: ['byFreeWord', freeWord] },
      ]).findAll();
      sendSuccess(res, newsCategories);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async userSelections (req: Request, res: Response) {
    try {
      const users = await UserModel.findAll({ attributes: ['id', 'fullName', 'username'] });
      sendSuccess(res, users);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async collaboratorSelections (req: Request, res: Response) {
    try {
      const { type, collaboratorId } = req.query;
      const scopes: any = ['withAddressInfo'];
      if (type) {
        scopes.push({ method: ['byType', type] });
      }
      if (collaboratorId) scopes.push({ method: ['byId', collaboratorId] });
      const collaborators = await CollaboratorModel.scope(scopes).findAll({ attributes: ['id', 'fullName', 'address', 'phoneNumber', 'type', 'username', 'provinceId', 'districtId', 'wardId'] });
      sendSuccess(res, collaborators);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async warehouseSelections (req: Request, res: Response) {
    try {
      const { status, warehouseId } = req.query;
      const scopes: any = [
        'withAddressInfo',
      ];
      if (status) scopes.push({ method: ['byStatus', status] });
      if (warehouseId) scopes.push({ method: ['byId', warehouseId] });
      const warehouses = await WarehouseModel.scope(scopes).findAll({ attributes: ['id', 'name', 'address', 'provinceId', 'districtId', 'wardId'] });
      sendSuccess(res, warehouses);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async listBillTemplateKeys (req: Request, res: Response) {
    try {
      const billTemplateKeys = await MBillTemplateKeyModel.findAll();
      sendSuccess(res, billTemplateKeys);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  public async listProducts (req: Request, res: Response) {
    try {
      const { warehouseId, productId, name, sku, saleCampaignId } = req.query;
      const scopes: any = [
        'withThumbnail',
        'withVariantDetails',
        'withPriceRange',
      ];
      if (productId) scopes.push({ method: ['byId', (productId as string).split(',')] });
      if (warehouseId) scopes.push({ method: ['byWarehouseId', warehouseId] });
      if (name) scopes.push({ method: ['byName', name] });
      if (sku) scopes.push({ method: ['bySkuCode', sku] });
      let products = await ProductModel.scope(scopes).findAll({
        order: [['createdAt', 'DESC']],
      });
      if (saleCampaignId) {
        const saleCampaign = await SaleCampaignModel.scope([
          'isAbleToUse',
          'withProductVariant',
          { method: ['byId', saleCampaignId] },
        ]).findOne();
        if (!saleCampaign) { return sendError(res, 404, NoData); }
        products = await SaleCampaignProductDecorator.calculatorVariantPrice(products, [saleCampaign]);
      }
      sendSuccess(res, products);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async listAddressBooks (req: Request, res: Response) {
    try {
      const { userId } = req.query;
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        'withAddressInfo',
        { method: ['bySorting', sortBy, sortOrder] },
      ];
      if (userId) scopes.push({ method: ['byUser', userId] });
      const addressBooks = await AddressBookModel.scope(scopes).findAll();
      sendSuccess(res, addressBooks);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async listSaleCampaign (req: Request, res: Response) {
    try {
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'DESC';
      const scopes: any = [
        'isAbleToUse',
        { method: ['bySorting', sortBy, sortOrder] },
      ];
      const saleCampaign = await SaleCampaignModel.scope(scopes).findAll();
      sendSuccess(res, saleCampaign);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new SelectionController();
