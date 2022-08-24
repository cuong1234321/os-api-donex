import { sendError } from '@libs/response';
import { Request, Response } from 'express';
import dayjs from 'dayjs';
import XlsxService from '@services/xlsx';
import MSizeModel from '@models/mSizes';

class MSizeController {
  public async download (req: Request, res: Response) {
    try {
      const time = dayjs().format('DD-MM-YY-hh:mm:ss');
      const fileName = `Danh-sach-size-${time}.xlsx`;
      const mSizes = await MSizeModel.findAll();
      const buffer: any = await XlsxService.downloadMSizes(mSizes);
      res.writeHead(200, [
        ['Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        ['Content-Disposition', 'attachment; filename=' + `${fileName}`],
      ]);
      res.end(Buffer.from(buffer, 'base64'));
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new MSizeController();
