import VoucherApplicationEntity from '@entities/voucherApplications';
import VoucherApplicationInterface from '@interfaces/voucherApplications';
import VoucherConditionInterface from '@interfaces/voucherConditions';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, Transaction, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import VoucherConditionModel from './voucherConditions';
import VoucherModel from './vouchers';

class VoucherApplicationModel extends Model<VoucherApplicationInterface> implements VoucherApplicationInterface {
  public id: number;
  public thumbnail: string;
  public title: string;
  public code: string;
  public paymentMethod: string;
  public beneficiaries: string;
  public description: string;
  public adminId: number;
  public status: string;
  public appliedAt: Date;
  public expiredAt: Date;
  public recipientLevel: string;
  public isAlreadySent: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly CREATABLE_PARAMETERS = ['title', 'appliedAt', 'expiredAt', 'description', 'beneficiaries', 'recipientLevel', 'code',
    { conditions: ['discountValue', 'orderValue', 'discountType'] },
    { paymentMethod: new Array(0) },
  ]

  static readonly UPDATABLE_PARAMETERS = ['title', 'appliedAt', 'expiredAt', 'description', 'beneficiaries', 'recipientLevel',
    { paymentMethod: new Array(0) },
    { conditions: ['discountValue', 'orderValue', 'discountType'] },

  ]

  static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' }

  static readonly PAYMENT_TYPE_ENUM = { ALL: 'all', VN_PAY: 'vnPAy', COD: 'COD', BANKING: 'banking' }
  static readonly RECIPIENT_LEVEL_ENUM = { ALL: 'all', TIER_1: 'tier1', TIER_2: 'tier2', BASE: 'base', VIP: 'vip' }
  static readonly BENEFICIARIES_ENUM = { USER: 'user', COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor', ALL: 'all' }

  static readonly hooks: Partial<ModelHooks<VoucherApplicationModel>> = {
    async beforeCreate (record: any) {
      if (record.isNewRecord && !record.code) {
        record.code = await record.generateVoucherCode();
      }
    },
    beforeSave (record: any) {
      if (this.beneficiaries === VoucherApplicationModel.BENEFICIARIES_ENUM.ALL) {
        record.recipientLevel = VoucherApplicationModel.RECIPIENT_LEVEL_ENUM.ALL;
      }
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validatePromoTime () {
      if (this.appliedAt > this.expiredAt) {
        throw new ValidationErrorItem('Thời gian áp dụng của chương trình không hợp lệ', 'validatePromoTime', 'appliedAt', this.appliedAt);
      }
    },
    async validateApplicationTime () {
      if (!this.isNewRecord &&
      dayjs(this.appliedAt).format() < dayjs().format()) {
        throw new ValidationErrorItem('Không thể thay đổi thông tin khi chương trình đã hoạt động', 'validatePromoTime', 'appliedAt', this.appliedAt);
      }
    },
    async validateRecipient () {
      if (this.recipientLevel === VoucherApplicationModel.RECIPIENT_LEVEL_ENUM.ALL) return;
      if ((this.beneficiaries === VoucherApplicationModel.BENEFICIARIES_ENUM.USER &&
        [VoucherApplicationModel.RECIPIENT_LEVEL_ENUM.TIER_1, VoucherApplicationModel.RECIPIENT_LEVEL_ENUM.TIER_2].includes(this.recipientLevel)) ||
        (this.beneficiaries === VoucherApplicationModel.BENEFICIARIES_ENUM.AGENCY &&
          ![VoucherApplicationModel.RECIPIENT_LEVEL_ENUM.TIER_1, VoucherApplicationModel.RECIPIENT_LEVEL_ENUM.TIER_2].includes(this.recipientLevel))) {
        throw new ValidationErrorItem('Đối tựợng được nhận khuyến mãi không hợp lệ', 'validateRecipient', 'recipientLevel', this.recipientLevel);
      }
    },
  }

  public async updateConditions (conditionAttributes: any[], transaction?: Transaction) {
    if (!conditionAttributes) return;
    conditionAttributes.forEach((attribute: any) => {
      attribute.voucherApplicationId = this.id;
    });
    const results = await VoucherConditionModel.bulkCreate(conditionAttributes, {
      updateOnDuplicate: VoucherConditionModel.UPDATABLE_ON_DUPLICATE_PARAMETERS as (keyof VoucherConditionInterface)[],
      individualHooks: true,
      transaction,
    });
    await VoucherConditionModel.destroy({
      where: { voucherApplicationId: this.id, id: { [Op.notIn]: results.map((condition) => condition.id) } },
      individualHooks: true,
      transaction,
    });
  }

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return {
        where: { id },
      };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    byFreeWord (freeWord) {
      return {
        where: {
          title: { [Op.like]: `%${freeWord || ''}%` },
        },
      };
    },
    byPaymentMethod (paymentMethod) {
      return {
        where: {
          [Op.or]: [
            Sequelize.literal(`FIND_IN_SET('${paymentMethod}', REPLACE(REPLACE(REPLACE(VoucherModel.paymentMethod, '[', ''), ']', ''), '"', '')) <> 0`),
          ],
        },
      };
    },
    byStatus (status) {
      return {
        where: {
          status,
        },
      };
    },
    withConditions () {
      return {
        include: [
          {
            model: VoucherConditionModel,
            as: 'conditions',
          },
        ],
      };
    },
    byDate (from, to) {
      if (!from && !to) return { where: {} };
      const createdAtCondition: any = {};
      if (from) Object.assign(createdAtCondition, { [Op.gt]: dayjs(from as string).startOf('day').format() });
      if (to) Object.assign(createdAtCondition, { [Op.lte]: dayjs(to as string).endOf('day').format() });
      return {
        where: { createdAt: createdAtCondition },
      };
    },
    byCode (code) {
      return {
        where: { code },
      };
    },
    isNotSentNotification () {
      return {
        where: {
          isAlreadySent: false,
        },
      };
    },
    isReadyToStart () {
      return {
        where: {
          status: VoucherApplicationModel.STATUS_ENUM.ACTIVE,
          isAlreadySent: false,
          [Op.and]: [
            { appliedAt: { [Op.lt]: dayjs().format() } },
            { expiredAt: { [Op.gt]: dayjs().format() } },
          ],
        },
      };
    },
  }

  public async generateVoucherCode () {
    let code = '';
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 6; i > 0; --i) code += characters[Math.floor(Math.random() * characters.length)];
    const existCode = await VoucherApplicationModel.scope([{ method: ['byCode', code] }]).findOne();
    if (existCode) code = await this.generateVoucherCode();
    return code;
  }

  public static initialize (sequelize: Sequelize) {
    this.init(VoucherApplicationEntity, {
      hooks: VoucherApplicationModel.hooks,
      scopes: VoucherApplicationModel.scopes,
      validate: VoucherApplicationModel.validations,
      tableName: 'voucher_applications',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.hasMany(VoucherModel, { as: 'vouchers', foreignKey: 'voucherApplicationId' });
    this.hasMany(VoucherConditionModel, { as: 'conditions', foreignKey: 'voucherApplicationId' });
  }
}

export default VoucherApplicationModel;