import axios, { AxiosRequestConfig } from 'axios';
import configs from '@configs/configs';
import setting from '@configs/settings';

class SendSmsService {
  public static async sendAuthenticateOtp (phoneNumber: string, otp: string) {
    if (phoneNumber.charAt(0) === '0') {
      phoneNumber = phoneNumber.replace('0', '+84');
    }
    const content = `[DONEX-SPORT] Chào mừng bạn đến với DONEX-SPORT. Mã OTP của bạn là: ${otp}. Thời hạn của OTP là ${setting.minuteOfOtpExpires} phút`;
    this.sendSms(phoneNumber, content);
  }

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
