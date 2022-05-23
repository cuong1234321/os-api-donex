
import axios, { AxiosRequestConfig } from 'axios';

class Order {
  static readonly REQUIRE_NOTE_ENUM = { CHO_THU_HANG: 'CHOTHUHANG', CHO_XEM_HANG_KHONG_THU: 'CHOXEMHANGKHONGTHU', KHONG_CHO_XEM_HANG: 'KHONGCHOXEMHANG' }

  public static async createGhnOrder (data: any) {
    console.log(data);
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.GHN_ENPOINT}/shipping-order/available-services`,
        headers: {
          token: process.env.GHN_TOKEN_API,
          shop_id: parseInt(process.env.GHN_SHOP_ID),
        },
        data: {
          to_name: 'userName',
          to_phone: 'userPhone',
          to_address: 'address',
          to_ward_code: data.ghnWardCode,
          to_district_id: data.ghnDistrictId,
          weight: 'weight',
          length: 'length',
          height: 'height',
          width: 'width',
          service_type_id: 'service_id',
          payment_type_id: data.payment_type_id || 1,
          required_note: data.requireNode || Order.REQUIRE_NOTE_ENUM.KHONG_CHO_XEM_HANG,
          pick_shift: data.pickShift || [1],
          pick_station_id: data.pickStationId,
          client_order_code: data.subOrderId,
          Items: [{
            name: 'product Name',
            quantity: 'quantity',
            price: 'price',
            length: 'length',
            width: 'width',
            height: 'height',
            category: {
              level1: 'Áo',
              level2: 'Áo',
              level3: 'Áo',
            },
          }],
        },
      };
      console.log(requestConfigs);
      const result = await axios(requestConfigs);
      const auth = result.data;
      return auth;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default Order;
