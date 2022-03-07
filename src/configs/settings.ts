import dotenv from 'dotenv';

dotenv.config();

export default {
  defaultPerPage: '12',
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
    ttl: '30d',
  },
  forgotPasswordTokenExpiresIn: 1,
  phonePattern: /^(84|0)[1-9][0-9]{8}$/,
  minuteOfOtpExpires: 15,
};
