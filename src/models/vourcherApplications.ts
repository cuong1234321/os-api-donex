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
  public paymentType: string;
  public beneficiaries: string;
  public description: string;
  public adminId: number;
  public status: string;
  public appliedAt: Date;
  public expiredAt: Date;
  public recipientLevel: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly CREATABLE_PARAMETERS = ['title', 'appliedAt', 'expiredAt', 'description', 'beneficiaries', 'paymentType', 'recipientLevel', 'code',
    { conditions: ['discountValue', 'orderValue', 'discountType'] },
  ]

  static readonly UPDATABLE_PARAMETERS = ['title', 'appliedAt', 'expiredAt', 'description', 'beneficiaries', 'paymentType', 'recipientLevel',
    { conditions: ['discountValue', 'orderValue', 'discountType'] },
  ]

  static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' }

  static readonly PAYMENT_TYPE_ENUM = { ALL: 'all', VN_PAY: 'vnPAy', COD: 'COD', BANKING: 'banking' }
  static readonly RECIPIENT_LEVEL_ENUM = { ALL: 'all', TIER_1: 'tier1', TIER_2: 'tier2', BASE: 'base', VIP: 'vip' }

  static readonly hooks: Partial<ModelHooks<VoucherApplicationModel>> = {
    async beforeCreate (record: any) {
      if (record.isNewRecord && !record.code) {
        record.code = await record.generateVoucherCode();
      }
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validatePromoTime () {
      if (this.appliedAt > this.expiredAt) {
        throw new ValidationErrorItem('Thời gian áp dụng của chương trình không hợp lệ', 'validatePromoTime', 'appliedAt', null);
      }
    },
    async validateInactiveApplication () {
      if ((this._previousDataValues.status === VoucherApplicationModel.STATUS_ENUM.ACTIVE && this.dataValues.status === VoucherApplicationModel.STATUS_ENUM.INACTIVE) &&
      dayjs(this.appliedAt).format() < dayjs().format()) {
        throw new ValidationErrorItem('Không thể tạm dừng chương trình đã hoạt động', 'validatePromoTime', 'appliedAt', null);
      }
    },
    async validateApplicationTime () {
      if ((this._previousDataValues.appliedAt !== this.dataValues.appliedAt) &&
      dayjs(this.appliedAt).format() < dayjs().format()) {
        throw new ValidationErrorItem('Không thể thay đổi thời gian khi chương trình đã hoạt động', 'validatePromoTime', 'appliedAt', null);
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
    byPaymentType (paymentType) {
      return {
        where: {
          paymentType,
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
