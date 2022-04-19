import AuthInterface from '@repositories/interfaces/auth';
import axios, { AxiosRequestConfig } from 'axios';

class Location {
  public static async login (params: AuthInterface) {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'GET',
        url: `${process.env.MISA_ENDPOINT}/${params.Environment}/api/v1/locations/bykindandparentid`,
        headers: {
          CompanyCode: params.CompanyCode,
          Authorization: 'Bearer' + params.AccessToken,
        },
        data: {
          kind: 0,
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
