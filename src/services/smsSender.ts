import axios, { AxiosRequestConfig } from 'axios';
import configs from '@configs/configs';

class SendSmsService {
  private static async sendSms (phoneNumber: string, content: string) {
    const payloadData = JSON.parse(JSON.stringify(configs.esmsConfig));
    payloadData.Phone = phoneNumber;
    payloadData.Content = content;
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: 'http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_post_json/',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(payloadData),
    };
    await axios(config);
  }
}

export default SendSmsService;
