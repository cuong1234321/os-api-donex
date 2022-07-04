
import axios, { AxiosRequestConfig } from 'axios';

class Store {
  public static async createStore (warehouse: any) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.GHN_ENPOINT}/shop/register`,
        headers: {
          token: process.env.GHN_TOKEN_API,
        },
        data: {
          district_id: warehouse.ghnDistrictId,
          ward_code: warehouse.ghnWardCode,
          name: warehouse.name,
          phone: warehouse.phone,
          address: warehouse.address,
        },
      };
      const result = await axios(requestConfigs);
      const store = result.data.data;
      return store;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default Store;
