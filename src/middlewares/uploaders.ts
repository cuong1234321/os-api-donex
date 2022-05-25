import path from 'path';
import multer from 'multer';
import { Request } from 'express';

const memoryStorage = multer.memoryStorage();

const productZipStorage = multer.diskStorage({
  destination: path.join(__dirname, '../../tmp'),
  filename: (req: Request, file, callback) => {
    callback(null, `products_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const withoutSavingUploader = multer({ storage: memoryStorage });
const productZipUploader = multer({ storage: productZipStorage });

export {
  withoutSavingUploader,
  productZipUploader,
};
