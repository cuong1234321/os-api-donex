
import AuthInterface from '@repositories/interfaces/auth';
import axios, { AxiosRequestConfig } from 'axios';

class ProductCategory {
  public static async index (authorization: AuthInterface, option: boolean) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'GET',
        url: `${process.env.MISA_ENDPOINT}/${authorization.Environment}/api/v1/categories/list`,
        headers: {
          CompanyCode: authorization.CompanyCode,
          Authorization: 'Bearer ' + authorization.AccessToken,
        },
        params: {
          includeInactive: option,
        },
      };
      const result = await axios(requestConfigs);
      const auth = result.data.Data;
      return auth;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default ProductCategory;
