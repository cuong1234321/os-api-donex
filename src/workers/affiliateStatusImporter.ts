import Bull, { Queue } from 'bull';
import configs from '@configs/configs';
import { getConsoleLogger } from '@libs/consoleLogger';
import AdminModel from '@models/admins';
import AffiliateStatusImporterService from '@services/affiliateStatusImporter';
import MailerService from '@services/mailer';

const errorLogger = getConsoleLogger('errorLogging');
const inboundLogging = getConsoleLogger('inboundLogging');
errorLogger.addContext('requestType', 'HttpLogging');
inboundLogging.addContext('requestType', 'ProductVerifyCodeImporterWorkerLogging');

class AffiliateStatusImporterWorker {
  public filePath: string;
  public queue: Queue;
  static readonly QUEUE_NAME = 'ProductImporterWorker'

  constructor (path: string, file: any, admin: AdminModel) {
    this.filePath = path;
    this.queue = new Bull(AffiliateStatusImporterWorker.QUEUE_NAME, { redis: configs.redis });
    this.queue.process(async (job, done) => {
      try {
        const productVerifyImporter = new AffiliateStatusImporterService(file);
        inboundLogging.info('Begin perform import product verify');
        const importResult = await productVerifyImporter.executeImport();
        await MailerService.importAffiliateStatusReport(importResult.totalRows, importResult.importeds.length, importResult.failToImportIndex, admin.email);
        inboundLogging.info('Complete perform import products');
        done();
        await this.queue.obliterate({ force: true });
        await this.queue.close();
      } catch (error) {
        this.queue.on('active', (job) => job.moveToFailed(new Error('Auto-killed during dev server restart')));
        this.queue.on('wait', (job) => job.remove());
        errorLogger.error(error);
        await this.queue.obliterate({ force: true });
        await this.queue.close();
      }
    });
  }

  public async scheduleJob () {
    const job = await this.queue.add({ path: this.filePath });
    return job;
  }
}

export default AffiliateStatusImporterWorker;
