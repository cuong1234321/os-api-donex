import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
import BannerEntity from '@entities/banners';
import BannerInterface from '@interfaces/banners';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import _ from 'lodash';

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
  static readonly UPDATABLE_PARAMETERS = ['title', 'linkDirect', 'position', 'image', 'isHighLight']
  static readonly TYPE_ENUM = { HOMEPAGE: 'homepage', PRODUCT: 'product', PROFILE: 'profile', NEWS: 'news', CARTS: 'carts' }
  static readonly POSITION_ENUM = { TOP: 'top', RIGHT: 'right', NEW_PRODUCT_SLIDE: 'newProductSlide', NEW_PRODUCT_BANNER: 'newProductBanner', FLASH_SALE: 'flashSale', HIGHLIGHT: 'highlight', PRODUCT_LIST: 'productList', PRODUCT_DETAIL: 'productDetail', SHOW: 'show' }
  static readonly MAX_BANNERS_SHOW_ALLOWED = { top: 4, right: 2, newProductSlide: 4, newProductBanner: 1, flashSale: 1, highlight: 1, productList: 1, productDetail: 1, show: 1 }

  static readonly validations: ModelValidateOptions = {
    async limitBanner () {
      const banners = await BannerModel.scope([
        { method: ['byPosition', this.position] },
        { method: ['byType', this.type] },
        'active',
      ]).findAll();
      if (banners.length >= BannerModel.MAX_BANNERS_SHOW_ALLOWED[this.position as 'top' | 'right' | 'newProductSlide' | 'newProductBanner' |'flashSale' | 'highlight' | 'productList' | 'productDetail']) {
        throw new ValidationErrorItem('Số lượng banner hiển thị đã đạt đến giới hạn tối đa.');
      }
    },

    async validatePosition () {
      if (!(await this.checkValidatePosition())) {
        throw new ValidationErrorItem('Vị trí của banner không thích hợp.', 'validatePosition', 'position');
      }
    },
  };

  static readonly hooks: Partial<ModelHooks<BannerModel>> = {
    async beforeUpdate (record, _options) {
      _options.validate = false;
      if (!record.previous('isHighLight') && record.isHighLight) record.orderId = await record.assignOrderId();
      if (record.previous('isHighLight') && !record.isHighLight) {
        record.orderId = null;
        await record.reorderBanners();
      }
    },

    async afterDestroy (record) {
      await record.reorderBanners();
    },
  }

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

  public checkValidatePosition () {
    if (this.type === BannerModel.TYPE_ENUM.HOMEPAGE && !['top', 'right', 'newProductSlide', 'newProductBanner', 'flashSale', 'highlight'].includes(this.position)) {
      return false;
    }
    if (this.type === BannerModel.TYPE_ENUM.NEWS && !['top', 'right'].includes(this.position)) {
      return false;
    }
    if (this.type === BannerModel.TYPE_ENUM.PRODUCT && !['productList', 'productDetail'].includes(this.position)) {
      return false;
    }
    if (this.type === BannerModel.TYPE_ENUM.PROFILE && !['top', 'show'].includes(this.position)) {
      return false;
    }
    if (this.type === BannerModel.TYPE_ENUM.CARTS && !['top', 'show'].includes(this.position)) {
      return false;
    }
    return true;
  }

  private async assignOrderId () {
    const activeBanners = await BannerModel.scope([
      { method: ['byPosition', this.position] },
      { method: ['byType', this.type] },
      'active']).findAll();
    const orderIds = activeBanners.map(banner => banner.orderId);
    const maxOrderId = _.max(orderIds) || 0;
    return maxOrderId + 1;
  }

  private async reorderBanners () {
    const record: any = this;
    const activeBanners = await BannerModel.scope([
      { method: ['byType', this.type] },
      { method: ['byPosition', this.position] },
      { method: ['byOrderIdAfter', record._previousDataValues.orderId] },
    ]).findAll();
    for (const [index, banner] of activeBanners.entries()) {
      await banner.update({ orderId: index + record._previousDataValues.orderId });
    }
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
