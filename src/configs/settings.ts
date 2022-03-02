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
};
