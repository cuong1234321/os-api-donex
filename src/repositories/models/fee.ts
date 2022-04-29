
import configs from '@configs/configs';
import MDistrictModel from '@models/mDistricts';
import MProvinceModel from '@models/mProvinces';
import MWardModel from '@models/mWards';
import WarehouseModel from '@models/warehouses';
import AuthInterface from '@repositories/interfaces/auth';
import FeeInterFace from '@repositories/interfaces/fee';
import axios, { AxiosRequestConfig } from 'axios';
import { ValidationError, ValidationErrorItem } from 'sequelize';

class Fee {
  static readonly FEE_CALCULATE_PARAMS = [
    'weight', 'length', 'width', 'height', 'isCOD', 'shippingPaymentType',
    'warehouseId', 'shippingProvinceId', 'shippingDistrictId', 'shippingWardId', 'shippingAddress', 'partnerType',
  ];

  public static async calculate (authenticate: AuthInterface, data: any) {
    try {
      await this.validWarehouse(data);
      await this.validProductValue(data);
      await this.validShippingAddress(data);
      const warehouse = await WarehouseModel.scope([
        { method: ['byId', data.warehouseId] },
        'withAddressInfo',
      ]).findOne();
      const params = await Fee.formatFeeParams(data, warehouse);
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.MISA_ENDPOINT}/${authenticate.Environment}/api/v1/shipping/calculate-all`,
        headers: {
          CompanyCode: authenticate.CompanyCode,
          Authorization: 'Bearer ' + authenticate.AccessToken,
        },
        data: params,
      };
      const result = await axios(requestConfigs);
      const fee = result.data;
      return fee;
    } catch (error) {
      if (error instanceof ValidationErrorItem) {
        throw new ValidationError(error.message, [error]);
      }
      return error?.response?.data;
    }
  }

  private static async validWarehouse (data: any) {
    const warehouse = await WarehouseModel.findByPk(data.warehouseId);
    if (!warehouse) {
      throw new ValidationErrorItem('kho hàng không tồn tại.', 'validWarehouse', 'warehouseId', data.warehouseId);
    }
  }

  private static async validShippingAddress (data: any) {
    const { province, district, ward } = await this.getAddress(data);
    if (!province || !district || !ward) {
      throw new ValidationErrorItem('Địa chỉ giao hàng không hợp lệ.', 'validShippingAddress');
    }
  }

  private static async validProductValue (data: any) {
    for (const [key, value] of Object.entries(data)) {
      if (['weight', 'length', 'width', 'height'].includes(key) && value < 0) {
        throw new ValidationErrorItem('Giá trị cần lớn hơn 0', 'validProductValue', `${key}`, key);
      }
    }
  }

  private static async validRequireParams (data: any) {
    for (const [key, value] of Object.entries(data)) {
      if (Object.entries(data).length !== Fee.FEE_CALCULATE_PARAMS.length ||
       (!['IsCOD', 'ShippingPaymentType'].includes(key) && !value)) {
        throw new ValidationErrorItem('Cần nhập đầy đủ thông tin giao vận', 'validRequireParams', `${key}`, key);
      }
    }
  }

  public static async formatFeeParams (data: any, warehouse: any) {
    const params: FeeInterFace = {
      Weight: data.weight,
      Length: data.length,
      Width: data.width,
      Height: data.height,
      From: {
        Address: warehouse.address,
        ProvinceId: warehouse.province.misaCode,
        DistrictId: warehouse.district.misaCode,
        WardId: warehouse.ward.misaCode,
      },
      To: {
        Address: data.shippingAddress,
        ProvinceId: data.shippingProvinceId,
        DistrictId: data.shippingDistrictId,
        WardId: data.shippingWardId,
      },
      IsCOD: true,
      ShippingPaymentType: data.shippingPaymentType ? 1 : 0,
      IntegrationApplication: process.env.MISA_APP_ID,
      CompanyCode: configs.donexInformation.Code,
      BranchId: configs.donexInformation.Id,
      Partner: data.partnerType,
    };
    return params;
  }

  private static async getAddress (data: any) {
    const province = await MProvinceModel.scope([
      { method: ['byMisaCode', data.shippingProvinceId] },
    ]).findOne();
    const district = await MDistrictModel.scope([
      { method: ['byMisaCode', data.shippingDistrictId] },
    ]).findOne();
    const ward = await MWardModel.scope([
      { method: ['byMisaCode', data.shippingWardId] },
    ]).findOne();
    return { province, district, ward };
  }
}

export default Fee;
