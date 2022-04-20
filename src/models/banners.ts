import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize } from 'sequelize';
import BannerEntity from '@entities/banners';
import BannerInterface from '@interfaces/banners';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class BannerModel extends Model<BannerInterface> implements BannerInterface {
  public id: number;
  public title: string;
  public linkDirect: string;
  public position: string;
  public image: string;
  public orderId: number;
  public type: string;
  public isHighLight: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly CREATABLE_PARAMETERS = ['title', 'linkDirect', 'position', 'image', 'type']
  static readonly TYPE_ENUM = { HOMEPAGE: 'homepage', PRODUCT: 'product', PROFILE: 'profile', NEWS: 'news' }
  static readonly POSITION_ENUM = { TOP: 'top', RIGHT: 'right', NEW_PRODUCT_SLIDE: 'newProductSlide', NEW_PRODUCT_BANNER: 'newProductBanner', FLASH_SALE: 'flashSale', HIGHLIGHT: 'highlight', PRODUCT_LIST: 'productList', PRODUCT_DETAIL: 'productDetail' }

  static readonly validations: ModelValidateOptions = {};

  static readonly hooks: Partial<ModelHooks<BannerModel>> = {}

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return {
        where: { id },
      };
    },
    byPosition (position) {
      return {
        where: { position },
      };
    },
    byType (type) {
      return {
        where: { type },
      };
    },
    byOrderIdAfter (orderId) {
      return { where: { orderId: { [Op.gt]: orderId } } };
    },
    byTitle (title) {
      return {
        where: {
          title: { [Op.like]: `%${title || ''}%` },
        },
      };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    byOrderSorting () {
      return {
        order: [[Sequelize.literal('orderId'), 'ASC']],
      };
    },
    active () {
      return {
        where: {
          isHighLight: true,
        },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(BannerEntity, {
      scopes: BannerModel.scopes,
      hooks: BannerModel.hooks,
      validate: BannerModel.validations,
      tableName: 'banners',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () { }
}

export default BannerModel;
