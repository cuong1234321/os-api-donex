import AuthInterface from '@repositories/interfaces/auth';
import axios, { AxiosRequestConfig } from 'axios';

class Location {
  public static async location (user: AuthInterface, params: any) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'GET',
        url: `${process.env.MISA_ENDPOINT}/${user.Environment}/api/v1/locations/bykindandparentid`,
        headers: {
          CompanyCode: user.CompanyCode,
          Authorization: 'Bearer ' + user.AccessToken,
        },
        params: {
          params,
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

  public static async locationByIds (params: AuthInterface) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.MISA_ENDPOINT}/${params.Environment}/api/v1/locations/byIds`,
        headers: {
          CompanyCode: params.CompanyCode,
          Authorization: 'Bearer ' + params.AccessToken,
        },
        data: {
          ids: ['VN'],
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

export default Location;
