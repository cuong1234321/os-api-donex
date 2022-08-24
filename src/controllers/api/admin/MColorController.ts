import { sendError } from '@libs/response';
import { Request, Response } from 'express';
import dayjs from 'dayjs';
import XlsxService from '@services/xlsx';
import MColorModel from '@models/mColors';

class MColorController {
  public async download (req: Request, res: Response) {
    try {
      const time = dayjs().format('DD-MM-YY-hh:mm:ss');
      const fileName = `Danh-sach-mau-sac-${time}.xlsx`;
      const mColors = await MColorModel.findAll();
      const buffer: any = await XlsxService.downloadMColors(mColors);
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

export default new MColorController();
