import dotenv from 'dotenv';

dotenv.config();

export default {
  esmsConfig: {
    ApiKey: process.env.ESMS_API_KEY,
    SecretKey: process.env.ESMS_SECRET_KEY,
    Brandname: 'FNOTIFY',
    SmsType: '2',
    campaignid: 'DONEX-SPORT',
  },
  mailerTransporter: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  },
  redis: {
    host: process.env.REDIS_HOST_NAME || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  donexInformation: {
    Id: 'f651fce0-e8f8-499d-b5f6-86fbafa15cea',
    Code: 'donexsport',
    Name: 'Công ty TNHH DONEXPRO Việt Nam',
    IsBaseDepot: false,
    IsChainBranch: false,
    ProvinceAddr: 'VN101',
    DistrictAddr: 'VN10106',
    CommuneAddr: 'VN1010617',
    Address: '161',
  },
  donexShipping: [
    {
      PartnerID: '736d4ec9-70ab-4032-a438-6249de8a7af7',
      PartnerCode: 'DTGH000002',
      Partner: 'GHTK',
      PartnerName: 'Giao hàng tiết kiệm',
    },
    {
      PartnerID: 'a6cb59f7-e3cf-413a-9ee7-66c2e7af75aa',
      PartnerCode: 'DTGH000001',
      Partner: 'GHN',
      PartnerName: 'GHN',
    },
    {
      PartnerID: '36402dc1-a496-4013-9d10-fee8d2459143',
      PartnerCode: 'DTGH000003',
      Partner: 'VTP',
      PartnerName: 'Viettel Post',
    },
  ],
};
