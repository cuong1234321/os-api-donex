import Bull, { Queue } from 'bull';
import configs from '@configs/configs';
import MarketingNotificationModel from '@models/marketingNotifications';

class SendSystemNotificationWorker {
  public marketingNotification: MarketingNotificationModel;
  public queue: Queue<any>;
  static readonly QUEUE_NAME = 'sendMarketingNotification';

  constructor (marketingNotification: MarketingNotificationModel) {
    this.marketingNotification = marketingNotification;
    this.queue = new Bull(SendSystemNotificationWorker.QUEUE_NAME, { redis: configs.redis });
    this.queue.process(async (job: any, done: any) => {
      const { data } = job;
      const { systemNotificationId } = data;
      const systemNotification = await MarketingNotificationModel.findByPk(systemNotificationId);
      await systemNotification.sendNotifications();
      done();
    });
    this.queue.on('completed', (job) => job.remove());
  }

  public async scheduleJob () {
    const delay = (new Date(this.marketingNotification.sendAt).getTime() - (new Date()).getTime());
    const job = await this.queue.add({ systemNotificationId: this.marketingNotification.id }, { delay });
    return job;
  }

  public async cancelJob () {
    const job = await this.queue.getJob(this.marketingNotification.jobId);
    if (job) job.remove();
  }
}

export default SendSystemNotificationWorker;
