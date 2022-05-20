import VoucherEntity from '@entities/vouchers';
import VoucherInterface from '@interfaces/vouchers';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import VoucherApplicationModel from './voucherApplications';
import VoucherConditionModel from './voucherConditions';

class VoucherModel extends Model<VoucherInterface> implements VoucherInterface {
  public id: number;
  public voucherApplicationId: number;
  public discount?: number;
  public recipientId: number;
  public recipientType: string;
  public activeAt?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public application?: VoucherApplicationModel;

  static readonly RECIPIENT_TYPE_ENUM = { USER: 'user', COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }

  static readonly hooks: Partial<ModelHooks<VoucherModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = {
    byRecipient (recipientId) {
      return {
        where: { recipientId },
      };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    withApplication () {
      return {
        include: [
          {
            model: VoucherApplicationModel,
            as: 'application',
            required: true,
            where: {
              status: VoucherApplicationModel.STATUS_ENUM.ACTIVE,
            },
            include: [
              {
                model: VoucherConditionModel,
                as: 'conditions',
              },
            ],
          },
        ],
      };
    },
    byStatus (status) {
      if (status === 'used') {
        return {
          where: {
            activeAt: { [Op.ne]: null },
          },
        };
      } else if (status === 'outOfDate') {
        return {
          include: [
            {
              model: VoucherApplicationModel,
              as: 'application',
              required: true,
              where: {
                expiredAt: { [Op.lt]: dayjs().format() },
              },
            },
          ],
        };
      } else if (status === 'active') {
        return {
          include: [
            {
              model: VoucherApplicationModel,
              as: 'application',
              required: true,
              where: {
                expiredAt: { [Op.gte]: dayjs() },
                appliedAt: { [Op.lte]: dayjs() },
              },
            },
          ],
        };
      }
    },
    byRecipientType (recipientType) {
      return {
        where: {
          recipientType,
        },
      };
    },
    byUserVoucher (id, recipientId, recipientType) {
      return {
        where: { id, recipientId, recipientType },
      };
    },
    byFreeWork (freeWord) {
      return {
        include: [
          {
            model: VoucherApplicationModel,
            as: 'application',
            required: true,
            where: {
              title: { [Op.like]: `%${freeWord || ''}%` },
            },
          },
        ],
      };
    },
    isNotUsed () {
      return {
        where: {
          activeAt: null,
        },
      };
    },
    byId (id) {
      return {
        where: { id },
      };
    },
    byVoucherApplication (paymentMethod) {
      return {
        include: [
          {
            model: VoucherApplicationModel,
            as: 'application',
            required: true,
            where: {
              expiredAt: { [Op.gte]: dayjs() },
              appliedAt: { [Op.lte]: dayjs() },
              [Op.or]: [
                Sequelize.literal(`FIND_IN_SET('${paymentMethod}', REPLACE(REPLACE(REPLACE(application.paymentMethod, '[', ''), ']', ''), '"', '')) <> 0`),
              ],
            },
            include: [{
              model: VoucherConditionModel,
              as: 'conditions',
            }],
          },
        ],
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(VoucherEntity, {
      hooks: VoucherModel.hooks,
      scopes: VoucherModel.scopes,
      validate: VoucherModel.validations,
      tableName: 'vouchers',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.belongsTo(VoucherApplicationModel, { as: 'application', foreignKey: 'voucherApplicationId' });
  }
}

export default VoucherModel;
