
import MWardModel from '@models/mWards';
import WarehouseModel from '@models/warehouses';
import axios, { AxiosRequestConfig } from 'axios';
import { ValidationError, ValidationErrorItem } from 'sequelize';

class Fee {
  static readonly FEE_CALCULATE_PARAMS = [
    'weight', 'length', 'width', 'height', 'insurance_value', 'service_id',
    'warehouseId', 'shippingProvinceId', 'shippingDistrictId', 'shippingWardId',
  ];

  static readonly FEE_SERVICE_PARAMS = [
    'warehouseId', 'shippingProvinceId', 'shippingDistrictId', 'shippingWardId',
  ];

  public static async calculate (data: any) {
    try {
      await this.validProductValue(data);
      let warehouse: any;
      let ward: any;
      if (!data.fromDistrictId || !data.toDistrictId) {
        warehouse = await this.getWareHouse(data);
        ward = await this.getWard(data);
      }
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.GHN_ENPOINT}/shipping-order/fee`,
        headers: {
          token: process.env.GHN_TOKEN_API,
          shop_id: parseInt(process.env.GHN_SHOP_ID),
        },
        data: {
          from_district_id: data.fromDistrictId || parseInt(warehouse.district.ghnDistrictId),
          to_district_id: data.toDistrictId || parseInt(ward.district.ghnDistrictId),
          service_type_id: parseInt(data.serviceTypeId) || null,
          service_id: parseInt(data.service_id) || null,
          height: parseInt(data.height),
          length: parseInt(data.length),
          weight: parseInt(data.weight),
          width: parseInt(data.width),
          insurance_value: parseInt(data.insurance_value),
          to_ward_code: data.toWardCode || null,
          coupon: null,
        },
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

  public static async getServicePack (data: any) {
    try {
      let warehouse: any;
      let ward: any;
      if (!data.fromDistrictId || !data.toDistrictId) {
        warehouse = await this.getWareHouse(data);
        ward = await this.getWard(data);
      }
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.GHN_ENPOINT}/shipping-order/available-services`,
        headers: { token: process.env.GHN_TOKEN_API },
        data: {
          shop_id: parseInt(process.env.GHN_SHOP_ID),
          from_district: data.fromDistrictId || parseInt(warehouse.district.ghnDistrictId),
          to_district: data.toDistrictId || parseInt(ward.district.ghnDistrictId),
        },
      };
      const result = await axios(requestConfigs);
      return {
        message: result.data.code_message_value,
        data: result.data.data.filter((record: any) => !!record.service_type_id),
      };
    } catch (error) {
      if (error instanceof ValidationErrorItem) {
        throw new ValidationError(error.message, [error]);
      }
      return error?.response?.data;
    }
  }

  private static async validProductValue (data: any) {
    for (const [key, value] of Object.entries(data)) {
      if (['weight', 'length', 'width', 'height'].includes(key) && value < 0) {
        throw new ValidationErrorItem('Giá trị cần lớn hơn 0', 'validProductValue', `${key}`, key);
      }
    }
  }

  private static async getWard (data: any) {
    const ward = await MWardModel.scope([
      { method: ['byId', data.shippingWardId] },
      'withAddress',
    ]).findOne();
    if (!ward) {
      throw new ValidationErrorItem('Địa chỉ không hợp lệ.', 'getServicePack', 'shippingDistrictId', data.shippingDistrictId);
    }
    return ward;
  }

  private static async getWareHouse (data: any) {
    const warehouse = await WarehouseModel.scope([
      { method: ['byId', data.warehouseId] },
      'withGhnDistrict',
    ]).findOne();
    if (!warehouse) {
      throw new ValidationErrorItem('kho hàng không tồn tại.', 'validWarehouse', 'warehouseId', data.warehouseId);
    }
    return warehouse;
  }
}

export default Fee;
