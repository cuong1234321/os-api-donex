
import AuthInterface from '@repositories/interfaces/auth';
import axios, { AxiosRequestConfig } from 'axios';

class ShippingPartner {
  public static async shippingPartner (params: AuthInterface, data: any) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.MISA_ENDPOINT}/${params.Environment}/api/v1/shipping/shipping-partner-all`,
        headers: {
          CompanyCode: params.CompanyCode,
          Authorization: 'Bearer ' + params.AccessToken,
        },
        data,
      };
      const result = await axios(requestConfigs);
      const auth = result.data;
      return auth;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default ShippingPartner;
