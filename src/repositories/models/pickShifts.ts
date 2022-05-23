
import axios, { AxiosRequestConfig } from 'axios';

class PickShift {
  public static async pickShifts () {
    try {
      const requestConfigs: AxiosRequestConfig = {
        method: 'GET',
        url: `${process.env.GHN_ENPOINT}/shift/date`,
        headers: {
          token: process.env.GHN_TOKEN_API,
        },
      };
      const result = await axios(requestConfigs);
      const pickShift = result.data.data;
      return pickShift;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default PickShift;
