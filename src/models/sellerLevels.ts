import SellerLevelEntity from '@entities/sellerLevels';
import SellerLevelInterface from '@interfaces/sellerLevels';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import CollaboratorModel from './collaborators';

class SellerLevelModel extends Model<SellerLevelInterface> implements SellerLevelInterface {
  public id: number;
  public type: string;
  public title: string;
  public conditionValue: number;
  public discountValue: number;
  public description: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly CREATABLE_PARAMETERS = ['type', 'title', 'conditionValue', 'discountValue', 'description'];
  static readonly UPDATABLE_PARAMETERS = ['title', 'conditionValue', 'discountValue', 'description'];

  static readonly TYPE_ENUM = { COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }

  static readonly validations: ModelValidateOptions = {
    async validateCondition () {
      if (this.deletedAt) return;
      const level = await SellerLevelModel.scope([
        { method: ['byType', this.type] },
        { method: ['byCondition', this.conditionValue] },
      ]).findOne();
      if (level) {
        throw new ValidationErrorItem('Điều kiện lên cấp không được trùng nhau.', 'validateCondition', 'conditionValue');
      }
    },
    async validateDiscountValue () {
      if (this.deletedAt) return;
      const level = await SellerLevelModel.scope([
        { method: ['byType', this.type] },
        { method: ['byDiscountValue', this.discountValue] },
      ]).findOne();
      if (level) {
        throw new ValidationErrorItem('Mức chiết khấu không được trùng nhau.', 'validateDiscountValue', 'discountValue');
      }
    },
    async validateDelete () {
      if (this.deletedAt) {
        const seller = await CollaboratorModel.scope([
          { method: ['byRank', this.id] },
        ]).findOne();
        if (seller) {
          throw new ValidationErrorItem('Tồn tại CTV/DL/NPP đang ở mức hạng này.', 'validateDelete', 'deletedAt');
        }
      }
    },
  }

  static readonly hooks: Partial<ModelHooks<SellerLevelModel>> = {}

  static readonly scopes: ModelScopeOptions = {
    byType (type) {
      return {
        where: { type },
      };
    },
    byCondition (conditionValue) {
      return {
        where: { conditionValue },
      };
    },
    byDiscountValue (discountValue) {
      return {
        where: { discountValue },
      };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(SellerLevelEntity, {
      scopes: SellerLevelModel.scopes,
      validate: SellerLevelModel.validations,
      hooks: SellerLevelModel.hooks,
      tableName: 'seller_levels',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () { }
}

export default SellerLevelModel;
