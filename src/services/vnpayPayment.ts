import dotenv from 'dotenv';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import dayjs from 'dayjs';
import QueryString from 'qs';
import settings from '@configs/settings';

dotenv.config();

class VnpayPaymentService {
  public txnRef: string;
  public amount: number;
  public createDate: string;
  public vnpayParams: any;

  static readonly QUERYABLE_PARAMETERS = ['vnp_Amount',
    'vnp_BankCode',
    'vnp_BankTranNo',
    'vnp_CardType',
    'vnp_OrderInfo',
    'vnp_PayDate',
    'vnp_ResponseCode',
    'vnp_TmnCode',
    'vnp_TransactionNo',
    'vnp_TransactionStatus',
    'vnp_TxnRef',
    'vnp_SecureHash',
  ]

  static readonly TXN_REF_PREFIX = { ORDER: 'O', TOP_UP: 'D' }

  constructor (orderableId: number, transactionId: string, amount: number, prefix: string, isNewOrder = false) {
    this.txnRef = isNewOrder ? `${prefix}_${dayjs().format('YYMMDDhhmmss')}_${orderableId}` : transactionId;
    this.amount = Math.round((amount + (amount * (settings.vnPayDefaultFeePercent / 100)) + settings.vnPayDefaultFee) * 100);
    this.createDate = dayjs().format('YYYYMMDDhhmmss');
    this.vnpayParams = {
      vnp_Amount: this.amount,
      vnp_Command: 'pay',
      vnp_CreateDate: this.createDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: '127.0.0.1',
      vnp_Locale: 'vn',
      vnp_OrderInfo: `${this.txnRef}`,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: `${process.env.CLIENT_DOMAIN}/callback/vnpay/payment-redirect`,
      vnp_TmnCode: process.env.VNPAY_TMNCODE,
      vnp_TxnRef: this.txnRef,
      vnp_Version: '2',
    };
  }

  public async makePayment () {
    this.vnpayParams.vnp_SecureHash = this.generateMakePaymentSecureHash();
    const paymentUrl = `${process.env.VNPAY_PAYMENT_ENDPOINT}?${QueryString.stringify(this.vnpayParams, { encode: true })}`;
    return paymentUrl;
  }

  public async validSignature (responseParams: any) {
    const returnSecureHash = responseParams.vnp_SecureHash;
    delete responseParams.vnp_SecureHash;
    delete responseParams.vnp_SecureHashType;
    const sortedParams = this.sortParams(responseParams);
    const signed = hmacSHA512(QueryString.stringify(sortedParams, { encode: false }), process.env.VNPAY_SECRET_KEY).toString();
    return signed === returnSecureHash;
  }

  private generateMakePaymentSecureHash () {
    const result = hmacSHA512(QueryString.stringify(this.vnpayParams, { encode: false }), process.env.VNPAY_SECRET_KEY).toString();
    return result;
  }

  private sortParams (input: any) {
    const sorted: any = {};
    const a = [];
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        a.push(encodeURIComponent(key));
      }
    }
    a.sort();
    for (let key = 0; key < a.length; key++) {
      sorted[a[key]] = encodeURIComponent(input[a[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }
}

export default VnpayPaymentService;
