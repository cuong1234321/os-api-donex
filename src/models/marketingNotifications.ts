import MarketingNotificationsEntity from '@entities/marketingNotifications';
import MarketingNotificationsInterface from '@interfaces/marketingNotifications';
import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class MarketingNotificationsModel extends Model<MarketingNotificationsInterface> implements MarketingNotificationsInterface {
  public id: number;
  public ownerId: number;
  public title: string;
  public content: string;
  public link: string;
  public isSentImmediately: boolean;
  public sendAt: Date;
  public status: string;
  public jobId: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt: Date;

  public static readonly STATUS_ENUM = { PENDING: 'pending', SENDED: 'sended' }

  static readonly hooks: Partial<ModelHooks<MarketingNotificationsModel>> = { }

  static readonly scopes: ModelScopeOptions = {
  }

  public static initialize (sequelize: Sequelize) {
    this.init(MarketingNotificationsEntity, {
      hooks: MarketingNotificationsModel.hooks,
      scopes: MarketingNotificationsModel.scopes,
      tableName: 'marketing_notifications',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
  }
}

export default MarketingNotificationsModel;
