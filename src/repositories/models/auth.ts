import SystemSettingModel from '@models/systemSetting';
import axios, { AxiosRequestConfig } from 'axios';
import { HmacSHA256 } from 'crypto-js';

class Auth {
  public static async misaLogin () {
    const loginParams: any = {
      AppID: process.env.MISA_APP_ID,
      Domain: process.env.MISA_DOMAIN,
      LoginTime: new Date(),
    };
    const result = HmacSHA256(JSON.stringify(loginParams), process.env.MISA_SECRET_KEY).toString();
    loginParams.SignatureInfo = result;
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'POST',
        url: `${process.env.MISA_ENDPOINT}/auth/api/account/login`,
        data: loginParams,
      };
      const result = await axios(requestConfigs);
      const auth = result.data.Data;
      const systemSetting: any = (await SystemSettingModel.findOrCreate({
        where: { },
        defaults: { id: undefined },
      }))[0];
      await systemSetting.update({
        environment: auth.Environment,
        accessToken: auth.AccessToken,
        companyCode: auth.CompanyCode,
      });
      return auth;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default Auth;
