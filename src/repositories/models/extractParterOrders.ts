
import axios, { AxiosRequestConfig } from 'axios';

class ExtractPartnerOrder {
  public static async generateToken (orderCodes: string[]) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.GHN_ENPOINT}/a5/gen-token`,
        headers: {
          token: process.env.GHN_TOKEN_API,
        },
        data: {
          order_codes: orderCodes,
        },
      };
      const result = await axios(requestConfigs);
      const token = result.data.data.token;
      return token;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public static async printOrder (orderToken: string) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'GET',
        url: `${process.env.GHN_EXPORT_ORDER_ENPOINT}/a5/public-api/printA5`,
        headers: {
          token: process.env.GHN_TOKEN_API,
        },
        params: {
          token: orderToken,
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

export default ExtractPartnerOrder;
