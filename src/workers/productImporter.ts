import fs from 'fs';
import Bull, { Queue } from 'bull';
import configs from '@configs/configs';
import { getConsoleLogger } from '@libs/consoleLogger';
import ProductImporterService from '@services/productImporter';
import AdminModel from '@models/admins';
import MailerService from '@services/mailer';

const errorLogger = getConsoleLogger('errorLogging');
const inboundLogging = getConsoleLogger('inboundLogging');
errorLogger.addContext('requestType', 'HttpLogging');
inboundLogging.addContext('requestType', 'ProductImporterWorkerLogging');

class ProductImporterWorker {
  public zipFilePath: string;
  public queue: Queue;
  static readonly QUEUE_NAME = 'ProductImporterWorker'

  constructor (path: string, adminId: number) {
    this.zipFilePath = path;
    this.queue = new Bull(ProductImporterWorker.QUEUE_NAME, { redis: configs.redis });
    this.queue.process(async (job, done) => {
      try {
        const { data } = job;
        const { path } = data;
        const productImporter = new ProductImporterService(path);
        await productImporter.extractZip();
        inboundLogging.info('Begin perform import products');
        const admin = await AdminModel.findByPk(adminId);
        const importResult = await productImporter.executeImport();
        fs.unlinkSync(path);
        await MailerService.importProductReport(importResult.totalRows, importResult.importedProducts.length, importResult.failToImportIndex, admin.email);
        inboundLogging.info('Complete perform import products');
        done();
        await this.queue.obliterate({ force: true });
      } catch (error) {
        this.queue.on('active', (job) => job.moveToFailed(new Error('Auto-killed during dev server restart')));
        this.queue.on('wait', (job) => job.remove());
        errorLogger.error(error);
        await this.queue.obliterate({ force: true });
      }
    });
    this.queue.on('completed', (job) => job.remove());
  }

  public async scheduleJob () {
    const job = await this.queue.add({ path: this.zipFilePath });
    return job;
  }
}

export default ProductImporterWorker;
