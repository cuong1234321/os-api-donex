import dotenv from 'dotenv';

dotenv.config();

export default {
  defaultPerPage: '12',
  defaultNewsPerPage: '10',
  fileStorageHost: process.env.FILE_STORAGE_HOST || 'https://flextech-dev.s3-ap-southeast-1.amazonaws.com',
  fileUploaderEndpoint: process.env.FILE_UPLOADER_ENDPOINT || 'https://ft-zcode-storage-service-api-dev-pdpxzax4za-as.a.run.app/files',
  imageStorageHost: process.env.IMAGE_STORAGE_HOST || 'https://flextech-dev.s3-ap-southeast-1.amazonaws.com',
  imageUploaderEndpoint: process.env.IMAGE_UPLOADER_ENDPOINT || 'http://103.163.214.14:8083/images?category=content',
  sessionSecret: 'bUfxkJXG5xOtaOqRyTmXqWGl4ZxNSyAPbJGVfc7DKix2lyBMJn6TtmKQER52q2eC',
  videoStorageHost: process.env.VIDEO_STORAGE_HOST || 'https://flextech-dev.s3-ap-southeast-1.amazonaws.com',
  videoUploaderEndpoint: process.env.VIDEO_UPLOADER_ENDPOINT || 'https://ft-zcode-storage-service-api-dev-pdpxzax4za-as.a.run.app/videos',
  jwt: {
    adminSecret: 'M85IWlSRy0nqckt3mTZzIsPVjR8cjm29tGevQUIgmrgSmhKjBz7BhySLd0jOhAVQ',
    userSecret: 'oG1VDoCZ9CPD4T99nv0OzFMyHP0G4uT3fznWrEli20aMqvaFA0ibCIt0OLHHLgIG',
    sellerSecret: 'cz8aIt8kXinpjyHJjOrKeKIjOy4vQzdveQOC4HxdwjMlMG0w6GkK6e1JSMg6Lj1c',
    ttl: '30d',
  },
  forgotPasswordTokenExpiresIn: 1,
  phonePattern: /^(84|0)[1-9][0-9]{8,9}$/,
  emailPattern: /^(([A-Za-z0-9]{1,}(\.)?)*[A-Za-z0-9]{1,})@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}))$/,
  minuteOfOtpExpires: 15,
  prefix: {
    imageMime: 'image',
    videoMime: 'video',
  },
  passwordAdminDefault: 'Aa@123456',
  defaultUserPassword: 'Aa@123456',
  defaultTax: 8,
  defaultValueConvertCoin: 0.5,
  warehouseTransferCode: 'CK',
  warehouseReceiptCode: 'NK',
  warehouseExportCode: 'XK',
  branchName: 'f651fce0-e8f8-499d-b5f6-86fbafa15cea',
  vnPayDefaultFee: 1650,
  vnPayDefaultFeePercent: 1.1,
  defaultRatingBonusPoint: 1,
  minMoneyUpRank: 500000,
  maxMoneyUpRank: 1000000,
  normalShippingDiscount: 1000000,
  rankShippingDiscount: 500000,
  orderOutOfDate: 363,
};
