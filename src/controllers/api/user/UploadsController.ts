import settings from '@configs/settings';
import { FileIsNotSupport } from '@libs/errors';
import { sendError, sendSuccess } from '@libs/response';
import ImageUploaderService from '@services/imageUploader';
import VideoUploaderService from '@services/videoUploader';
import { Request, Response } from 'express';

class UploadController {
  public async uploads (req: Request, res: Response) {
    try {
      const links: any = [];
      const folder = 'public';
      const files: any[] = req.files as any[];
      for (const file of files) {
        const attribute: any = {};
        if (file.mimetype.split('/')[0] === settings.prefix.imageMime) {
          attribute.source = await ImageUploaderService.singleUpload(file, folder);
          attribute.type = settings.prefix.imageMime;
        } else if (file.mimetype.split('/')[0] === settings.prefix.videoMime) {
          attribute.source = await VideoUploaderService.singleUpload(file, folder);
          attribute.type = settings.prefix.videoMime;
        } else {
          return sendError(res, 403, FileIsNotSupport);
        }
        links.push(attribute);
      }
      sendSuccess(res, links);
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}
export default new UploadController();
