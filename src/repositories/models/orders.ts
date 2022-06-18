import axios, { AxiosRequestConfig } from 'axios';

class Order {
  static readonly REQUIRE_NOTE_ENUM = { CHO_THU_HANG: 'CHOTHUHANG', CHO_XEM_HANG_KHONG_THU: 'CHOXEMHANGKHONGTHU', KHONG_CHO_XEM_HANG: 'KHONGCHOXEMHANG' }

  public static async createGhnOrder (data: any) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.GHN_ENPOINT}/shipping-order/create`,
        headers: {
          Token: process.env.GHN_TOKEN_API,
          ShopId: parseInt(process.env.GHN_SHOP_ID),
        },
        data: {
          to_name: data.fullName,
          to_phone: data.userPhone,
          to_address: data.address,
          to_ward_code: data.ghnWardCode,
          to_district_id: data.ghnDistrictId,
          weight: data.weight,
          length: data.length || 1,
          height: data.height || 1,
          width: data.width || 1,
          service_type_id: data.serviceTypeId || 2,
          client_order_code: data.clientCode,
          payment_type_id: data.paymentTypeId || 1,
          required_note: data.requireNode || Order.REQUIRE_NOTE_ENUM.KHONG_CHO_XEM_HANG,
          pick_shift: [data.pickShift || 2],
          cod_amount: data.codAmount,
          items: data.items,
          insurance_value: data.insuranceValue,
          return_phone: data.returnPhone,
        },
      };
      const result = await axios(requestConfigs);
      const dataResponse = {
        message: result.data.code_message_value,
        orderCode: result.data.data.order_code,
        fee: result.data.data.total_fee,
        expectedDeliveryTime: result.data.data.expected_delivery_time,
      };
      return dataResponse;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public static async getDeliveryPartner (data: any) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.GHN_ENPOINT}/shipping-order/detail-by-client-code`,
        headers: {
          Token: process.env.GHN_TOKEN_API,
        },
        data: {
          client_order_code: data.code,
        },
      };
      const result = await axios(requestConfigs);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public static async cancelOrder (data: any) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.GHN_ENPOINT}/switch-status/cancel`,
        headers: {
          Token: process.env.GHN_TOKEN_API,
        },
        data: {
          order_codes: data.orderPartnerCode,
        },
      };
      const result = await axios(requestConfigs);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public static async returnOrder (data: any) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.GHN_ENPOINT}/switch-status/return`,
        headers: {
          Token: process.env.GHN_TOKEN_API,
        },
        data: {
          order_codes: data.orderPartnerCode,
        },
      };
      const result = await axios(requestConfigs);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default Order;
