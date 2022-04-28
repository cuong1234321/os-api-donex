import CollaboratorEntity from '@entities/collaborators';
import CollaboratorMediaInterface from '@interfaces/collaboratorMedia';
import CollaboratorInterface from '@interfaces/collaborators';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, Transaction, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import bcrypt from 'bcryptjs';
import settings from '@configs/settings';
import CollaboratorWorkingDayInterface from '@interfaces/collaboratorWorkingDays';
import dayjs from 'dayjs';
import CollaboratorWorkingDayModel from './collaboratorWorkingDays';
import CollaboratorMediaModel from './collaboratorMedia';
import VoucherApplicationModel from './voucherApplications';
import VoucherModel from './vouchers';

class CollaboratorModel extends Model<CollaboratorInterface> implements CollaboratorInterface {
  public id: number;
  public parentId: number;
  public type: string;
  public status: string;
  public paperProofFront: string;
  public paperProofBack: string;
  public rejectionReason: string;
  public openTime: Date;
  public closeTime: Date;
  public lat: string;
  public long: string;
  public addressTitle: string;
  public provinceId: number;
  public districtId: number;
  public wardId: number;
  public address: string;
  public fullName: string;
  public phoneNumber: string;
  public username: string;
  public password: string;
  public confirmPassword?: string;
  public email: string;
  public dateOfBirth: Date;
  public defaultRank: number;
  public forgotPasswordToken: string;
  public forgotPasswordExpireAt: Date;
  public avatar: string;
  public rejectorId: number;
  public rejectDate: Date;

  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static readonly TYPE_ENUM = { COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }
  public static readonly STATUS_ENUM = { PENDING: 'pending', ACTIVE: 'active', INACTIVE: 'inactive', REJECTED: 'rejected' }

  public static readonly CREATABLE_PARAMETERS = ['type', 'parentId', 'openTime', 'closeTime', 'lat', 'long', 'addressTitle', 'fullName', 'dateOfBirth', 'phoneNumber', 'username', 'password', 'email', 'provinceId', 'districtId', 'wardId', 'address', 'defaultRank']
  public static readonly UPDATABLE_PARAMETERS = ['type', 'parentId', 'openTime', 'closeTime', 'lat', 'long', 'addressTitle', 'fullName', 'dateOfBirth', 'phoneNumber', 'email', 'provinceId', 'districtId', 'wardId', 'address', 'defaultRank']
  public static readonly CREATABLE_COLLABORATOR_PARAMETERS = ['phoneNumber', 'fullName', 'email', 'provinceId', 'districtId', 'wardId', 'address', 'dateOfBirth', 'type', 'lat', 'long', 'addressTitle', 'paperProofFront', 'paperProofBack',
    { media: ['source', 'type'] },
  ]

  static readonly hooks: Partial<ModelHooks<CollaboratorModel>> = {
    beforeSave (record) {
      if (record.type === CollaboratorModel.TYPE_ENUM.DISTRIBUTOR) record.parentId = null;
      if (record.password && record.password !== record.previous('password')) {
        const salt = bcrypt.genSaltSync();
        record.password = bcrypt.hashSync(record.password, salt);
      }
    },
  }

  static readonly validations: ModelValidateOptions = {
    async uniquePhoneNumber () {
      if (this.phoneNumber) {
        const existedRecord = await CollaboratorModel.findOne({
          attributes: ['id'], where: { phoneNumber: this.phoneNumber },
        });
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Số điện thoại đã được sử dụng.', 'uniquePhoneNumber', 'phoneNumber', this.phoneNumber);
        }
      }
    },
    async uniqueUsername () {
      if (this.username) {
        const existedRecord = await CollaboratorModel.scope([{ method: ['byUsername', this.username] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Tài khoản đã được sử dụng.', 'uniqueUsername', 'username', this.username);
        }
      }
    },
    async uniqueEmail () {
      if (this.email) {
        const existedRecord = await CollaboratorModel.scope([{ method: ['byEmail', this.email] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Email đã được sử dụng.', 'uniqueEmail', 'email', this.email);
        }
      }
    },
    async validatePhoneNumber () {
      if (this.phoneNumber && !settings.phonePattern.test(this.phoneNumber)) {
        throw new ValidationErrorItem('Số điện thoại không hợp lệ', 'validatePhoneNumber', 'phoneNumber');
      }
    },
    async validateEmail () {
      if (this.email && !settings.emailPattern.test(this.email)) {
        throw new ValidationErrorItem('Email không hợp lệ', 'validateEmail', 'email');
      }
    },
    async validateChangeBirthDay () {
      if (!dayjs(this._previousDataValues.dateOfBirth).format()) return;
      if (this._previousDataValues.dateOfBirth && dayjs(this._previousDataValues.dateOfBirth).format() !== dayjs(this.dataValues.dateOfBirth).format()) {
        throw new ValidationErrorItem('Ngày sinh không được thay đổi', 'validateChangeBirthDay', 'dateOfBirth', this.dateOfBirth);
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
    addressInfo () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT title FROM m_provinces WHERE m_provinces.id = CollaboratorModel.provinceId)'),
              'provinceTitle',
            ],
            [
              Sequelize.literal('(SELECT title FROM m_districts WHERE m_districts.id = CollaboratorModel.districtId)'),
              'districtTitle',
            ],
            [
              Sequelize.literal('(SELECT title FROM m_wards WHERE m_wards.id = CollaboratorModel.wardId)'),
              'wardTitle',
            ],
          ],
        },
      };
    },
    byId (id) {
      return {
        where: { id },
      };
    },
    byStatus (status) {
      return {
        where: { status },
      };
    },
    byType (type) {
      return {
        where: { type },
      };
    },
    byUsername (username) {
      return {
        where: { username },
      };
    },
    byEmail (email) {
      return {
        where: { email },
      };
    },
    withoutParent () {
      return {
        where: {
          parentId: null,
        },
      };
    },
    byFreeWord (freeWord) {
      return {
        where: {
          [Op.or]: [
            { fullName: { [Op.like]: `%${freeWord || ''}%` } },
            { username: { [Op.like]: `%${freeWord || ''}%` } },
            { phoneNumber: { [Op.like]: `%${freeWord || ''}%` } },
          ],
        },
      };
    },
    bySortOrder (orderConditions) {
      return {
        order: orderConditions,
      };
    },
    byFreeWordStore (freeWord) {
      return {
        where: {
          [Op.or]: [
            { fullName: { [Op.like]: `%${freeWord || ''}%` } },
            {
              provinceId: {
                [Op.in]: Sequelize.literal(`(SELECT id FROM m_provinces WHERE title LIKE '%${freeWord}%')`),
              },
            },
            {
              districtId: {
                [Op.in]: Sequelize.literal(`(SELECT id FROM m_districts WHERE title LIKE '%${freeWord}%')`),
              },
            },
          ],
        },
      };
    },
    withWorkingDay () {
      return {
        include: [{
          model: CollaboratorWorkingDayModel,
          as: 'workingDays',
        }],
      };
    },
    withMedia () {
      return {
        include: {
          model: CollaboratorMediaModel,
          as: 'media',
        },
      };
    },
    withRejectorName () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT fullName FROM admins WHERE id = CollaboratorModel.rejectorId)'),
              'rejectorName',
            ],
          ],
        },
      };
    },
  }

  public async checkStatus (status: string) {
    if (this.status !== status) {
      throw new ValidationErrorItem(`status is not ${status}.`, 'status', 'validStatus', this.status);
    }
  }

  public async reloadCollaborator () {
    await this.reload({
      include: [
        {
          model: CollaboratorWorkingDayModel,
          as: 'workingDays',
        },
        {
          model: CollaboratorMediaModel,
          as: 'media',
        },
      ],
    });
  }

  public async updateMedias (medias: any[], transaction?: Transaction) {
    if (!medias) return;
    medias.forEach((record: any) => {
      record.collaboratorId = this.id;
    });

    const results = await CollaboratorMediaModel.bulkCreate(medias, {
      updateOnDuplicate: CollaboratorMediaModel.UPDATABLE_ON_DUPLICATE_PARAMETERS as (keyof CollaboratorMediaInterface)[],
      individualHooks: true,
      transaction,
    });
    await CollaboratorMediaModel.destroy({
      where: { collaboratorId: this.id, id: { [Op.notIn]: results.map((media) => media.id) } },
      individualHooks: true,
      transaction,
    });
  }

  public async updateListCollaboratorWorkingDay (collaboratorWorkingDays: any[], transaction?: Transaction) {
    for (const element of collaboratorWorkingDays) {
      element.collaboratorId = this.id;
    }
    const listCollaboratorWorkingDay = await CollaboratorWorkingDayModel.bulkCreate(collaboratorWorkingDays, {
      updateOnDuplicate: CollaboratorWorkingDayModel.UPDATABLE_ON_DUPLICATE_PARAMETERS as (keyof CollaboratorWorkingDayInterface)[],
      individualHooks: true,
      transaction,
    });
    const collaboratorWorkingDayIds = listCollaboratorWorkingDay.map((index: any) => index.id);
    await CollaboratorWorkingDayModel.destroy({ where: { id: { [Op.notIn]: collaboratorWorkingDayIds } }, transaction });
  }

  public static initialize (sequelize: Sequelize) {
    this.init(CollaboratorEntity, {
      hooks: CollaboratorModel.hooks,
      scopes: CollaboratorModel.scopes,
      validate: CollaboratorModel.validations,
      tableName: 'collaborators',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
    this.hasMany(CollaboratorWorkingDayModel, { as: 'workingDays', foreignKey: 'collaboratorId', onDelete: 'CASCADE', hooks: true });
    this.hasMany(CollaboratorMediaModel, { as: 'media', foreignKey: 'collaboratorId', onDelete: 'CASCADE', hooks: true });
    this.belongsToMany(VoucherApplicationModel, {
      through: VoucherModel,
      as: 'collaboratorVouchers',
      foreignKey: 'recipientId',
      scope: { recipientType: { [Op.ne]: VoucherModel.RECIPIENT_TYPE_ENUM.USER } },
    });
  }
}

export default CollaboratorModel;
