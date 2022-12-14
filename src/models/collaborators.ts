import CollaboratorEntity from '@entities/collaborators';
import CollaboratorMediaInterface from '@interfaces/collaboratorMedia';
import CollaboratorInterface from '@interfaces/collaborators';
import { BelongsToGetAssociationMixin, HasManyGetAssociationsMixin, Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, Transaction, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import bcrypt from 'bcryptjs';
import settings from '@configs/settings';
import CollaboratorWorkingDayInterface from '@interfaces/collaboratorWorkingDays';
import dayjs from 'dayjs';
import MailerService from '@services/mailer';
import randomString from 'randomstring';
import jwt from 'jsonwebtoken';
import CollaboratorWorkingDayModel from './collaboratorWorkingDays';
import CollaboratorMediaModel from './collaboratorMedia';
import VoucherApplicationModel from './voucherApplications';
import VoucherModel from './vouchers';
import MDistrictModel from './mDistricts';
import MProvinceModel from './mProvinces';
import MWardModel from './mWards';
import SellerLevelModel from './sellerLevels';

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
  public currentRank: number;
  public forgotPasswordToken: string;
  public forgotPasswordExpireAt: Date;
  public avatar: string;
  public rejectorId: number;
  public rejectDate: Date;
  public referralCode: string;
  public accumulatedMoney: number;

  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static readonly TYPE_ENUM = { COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }
  public static readonly STATUS_ENUM = { PENDING: 'pending', ACTIVE: 'active', INACTIVE: 'inactive', REJECTED: 'rejected' }

  public static readonly CREATABLE_PARAMETERS = ['type', 'parentId', 'openTime', 'closeTime', 'lat', 'long', 'addressTitle', 'fullName', 'dateOfBirth', 'phoneNumber', 'username', 'password', 'email', 'provinceId', 'districtId', 'wardId', 'address', 'defaultRank']
  public static readonly UPDATABLE_PARAMETERS = ['type', 'parentId', 'openTime', 'closeTime', 'lat', 'long', 'addressTitle', 'fullName', 'dateOfBirth', 'phoneNumber', 'email', 'provinceId', 'districtId', 'wardId', 'address', 'defaultRank']
  public static readonly SELLER_UPDATABLE_PARAMETERS = ['openTime', 'closeTime', 'lat', 'long', 'addressTitle', 'fullName', 'dateOfBirth', 'phoneNumber', 'email', 'provinceId', 'districtId', 'wardId', 'address']
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
    async beforeCreate (record: any) {
      record.referralCode = await this.generateReferralCode();
    },
  }

  static readonly validations: ModelValidateOptions = {
    async uniquePhoneNumber () {
      if (this.phoneNumber) {
        const existedRecord = await CollaboratorModel.findOne({
          attributes: ['id'], where: { phoneNumber: this.phoneNumber },
        });
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('S??? ??i???n tho???i ???? ???????c s??? d???ng.', 'uniquePhoneNumber', 'phoneNumber', this.phoneNumber);
        }
      }
    },
    async uniqueUsername () {
      if (this.username) {
        const existedRecord = await CollaboratorModel.scope([{ method: ['byUsername', this.username] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('T??i kho???n ???? ???????c s??? d???ng.', 'uniqueUsername', 'username', this.username);
        }
      }
    },
    async uniqueEmail () {
      if (this.email) {
        const existedRecord = await CollaboratorModel.scope([{ method: ['byEmail', this.email] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Email ???? ???????c s??? d???ng.', 'uniqueEmail', 'email', this.email);
        }
      }
    },
    async validatePhoneNumber () {
      if (this.phoneNumber && !settings.phonePattern.test(this.phoneNumber)) {
        throw new ValidationErrorItem('S??? ??i???n tho???i kh??ng h???p l???', 'validatePhoneNumber', 'phoneNumber');
      }
    },
    async validateEmail () {
      if (this.email && !settings.emailPattern.test(this.email)) {
        throw new ValidationErrorItem('Email kh??ng h???p l???', 'validateEmail', 'email');
      }
    },
    async validateChangeBirthDay () {
      if (!dayjs(this._previousDataValues.dateOfBirth).format()) return;
      if (this._previousDataValues.dateOfBirth && dayjs(this._previousDataValues.dateOfBirth).format() !== dayjs(this.dataValues.dateOfBirth).format()) {
        throw new ValidationErrorItem('Ng??y sinh kh??ng ???????c thay ?????i', 'validateChangeBirthDay', 'dateOfBirth', this.dateOfBirth);
      }
    },
    async validateStatus () {
      if (this.deletedAt && this.status !== CollaboratorModel.STATUS_ENUM.INACTIVE) {
        throw new ValidationErrorItem('Ch??? x??a ???????c CTV/DL/NPP trong tr???ng th??i t???m kh??a', 'validStatus', 'status', this.status);
      }
    },
  }

  public getProvince: BelongsToGetAssociationMixin<MProvinceModel>;
  public getDistrict: BelongsToGetAssociationMixin<MDistrictModel>;
  public getWard: BelongsToGetAssociationMixin<MWardModel>;
  public getParent: BelongsToGetAssociationMixin<CollaboratorModel>;
  public getMedia: HasManyGetAssociationsMixin<CollaboratorMediaModel>;
  public getWorkingDays: HasManyGetAssociationsMixin<CollaboratorWorkingDayModel>;

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
    byPhoneNumber (phoneNumber) {
      return {
        where: { phoneNumber },
      };
    },
    byRank (levelId) {
      return {
        where: {
          [Op.or]: [
            { defaultRank: levelId },
            { currentRank: levelId },
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
    withAddressInfo () {
      return {
        include: [
          {
            model: MProvinceModel,
            as: 'province',
          },
          {
            model: MDistrictModel,
            as: 'district',
          },
          {
            model: MWardModel,
            as: 'ward',
          },
        ],
      };
    },
    withParent () {
      return {
        include: [
          {
            model: CollaboratorModel,
            as: 'parent',
            attributes: ['fullName'],
          },
        ],
      };
    },
    withDefaultRank () {
      return {
        include: [
          {
            model: SellerLevelModel,
            as: 'defaultLevel',
          },
        ],
      };
    },
    withCurrentRank () {
      return {
        include: [
          {
            model: SellerLevelModel,
            as: 'currentLevel',
          },
        ],
      };
    },
    byReferral (referralCode) {
      return {
        where: { referralCode },
      };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    withTotalListedPrice (from, to) {
      from = !from ? dayjs('2000').startOf('year').format() : dayjs(from).startOf('day').format();
      to = !to ? dayjs('3000').startOf('year').format() : dayjs(to).endOf('day').format();
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(listedPrice * quantity) FROM order_items WHERE order_items.deletedAt IS NULL AND ' +
              'order_items.subOrderId IN (SELECT id FROM sub_orders WHERE sub_orders.deletedAt IS NULL AND sub_orders.status = "delivered" AND ' +
              `sub_orders.createdAt BETWEEN "${from}" AND "${to}" AND ` +
              'sub_orders.orderId IN (SELECT orders.id FROM orders WHERE orders.orderableType <> "user" AND orders.orderableId = CollaboratorModel.id)))'), 'SIGNED'),
              'totalListedPrice',
            ],
          ],
        },
      };
    },
    withTotalDiscount (from, to) {
      from = !from ? dayjs('2000').startOf('year').format() : dayjs(from).startOf('day').format();
      to = !to ? dayjs('3000').startOf('year').format() : dayjs(to).endOf('day').format();
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(order_items.saleCampaignDiscount * order_items.quantity) + SUM(sub_orders.coinDiscount + sub_orders.voucherDiscount + sub_orders.rankDiscount + sub_orders.totalOtherDiscount) FROM order_items ' +
              'INNER JOIN sub_orders ON sub_orders.id = order_items.subOrderId AND sub_orders.status = "delivered" AND sub_orders.deletedAt IS NUll AND ' +
              `sub_orders.createdAt BETWEEN "${from}" AND "${to}" ` +
              'WHERE order_items.deletedAt IS NULL AND sub_orders.orderId IN (SELECT orders.id FROM orders WHERE orders.orderableType <> "user" AND orders.deletedAt IS NULL AND orders.orderableId = `CollaboratorModel`.id))'), 'SIGNED'),
              'totalDiscount',
            ],
          ],
        },
      };
    },
    byOrderQuantity (fromValue, toValue, fromDate, toDate) {
      fromDate = !fromDate ? dayjs('2000').startOf('year').format() : dayjs(fromDate).startOf('day').format();
      toDate = !toDate ? dayjs('3000').startOf('year').format() : dayjs(toDate).endOf('day').format();
      return {
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.cast(Sequelize.literal('(SELECT COUNT(*) FROM sub_orders INNER JOIN orders ON orders.id = sub_orders.orderId ' +
            'AND orderableType <> "user" AND orderableId = CollaboratorModel.id WHERE sub_orders.deletedAt IS NULL AND sub_orders.status = "delivered" ' +
            `AND sub_orders.createdAt BETWEEN "${fromDate}" AND "${toDate}")`), 'SIGNED'),
            {
              [Op.between]: [fromValue, toValue],
            }),
          ],
        },
      };
    },
    byTotalListedPrice (fromValue, toValue, fromDate, toDate) {
      fromDate = !fromDate ? dayjs('2000').startOf('year').format() : dayjs(fromDate).startOf('day').format();
      toDate = !toDate ? dayjs('3000').startOf('year').format() : dayjs(toDate).endOf('day').format();
      return {
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.cast(Sequelize.literal('(SELECT SUM(listedPrice * quantity) FROM order_items WHERE order_items.deletedAt IS NULL AND ' +
            'order_items.subOrderId IN (SELECT id FROM sub_orders WHERE sub_orders.deletedAt IS NULL AND sub_orders.status = "delivered" AND ' +
            `sub_orders.createdAt BETWEEN "${fromDate}" AND "${toDate}" AND ` +
            'sub_orders.orderId IN (SELECT orders.id FROM orders WHERE orders.orderableType <> "user" AND orders.orderableId = CollaboratorModel.id)))'), 'SIGNED'),
            {
              [Op.between]: [fromValue, toValue],
            }),
          ],
        },
      };
    },
    byTotalDiscount (fromValue, toValue, fromDate, toDate) {
      fromDate = !fromDate ? dayjs('2000').startOf('year').format() : dayjs(fromDate).startOf('day').format();
      toDate = !toDate ? dayjs('3000').startOf('year').format() : dayjs(toDate).endOf('day').format();
      return {
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.cast(Sequelize.literal('(SELECT SUM(order_items.saleCampaignDiscount * order_items.quantity) + SUM(sub_orders.coinDiscount + sub_orders.voucherDiscount + sub_orders.rankDiscount + sub_orders.totalOtherDiscount) FROM order_items ' +
            'INNER JOIN sub_orders ON sub_orders.id = order_items.subOrderId AND sub_orders.status = "delivered" AND sub_orders.deletedAt IS NUll AND ' +
            `sub_orders.createdAt BETWEEN "${fromDate}" AND "${toDate}" ` +
            'WHERE order_items.deletedAt IS NULL AND sub_orders.orderId IN (SELECT orders.id FROM orders WHERE orders.orderableType <> "user" AND orders.deletedAt IS NULL AND orders.orderableId = `CollaboratorModel`.id))'), 'SIGNED'),
            {
              [Op.between]: [fromValue, toValue],
            }),
          ],
        },
      };
    },
  }

  public async validPassword (password: string) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      return false;
    }
  }

  public async generateAccessToken () {
    const token = jwt.sign({ id: this.id }, settings.jwt.sellerSecret, { expiresIn: settings.jwt.ttl });
    return token;
  };

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

  public async sendOtp () {
    const token = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
    const expireAt = (dayjs().add(settings.forgotPasswordTokenExpiresIn, 'hour'));
    await this.update(
      {
        forgotPasswordToken: token,
        forgotPasswordExpireAt: expireAt,
      },
    );
    MailerService.collaboratorForgotPassWord(this, token);
  }

  public async checkValidForgotPasswordToken (token: string) {
    return this.forgotPasswordToken === token && (!this.forgotPasswordExpireAt || dayjs(this.forgotPasswordExpireAt) > dayjs());
  }

  public async genLifetimeForgotPasswordToken () {
    const token = randomString.generate(64);
    await this.update(
      {
        forgotPasswordToken: token,
        forgotPasswordExpireAt: null,
      },
    );
  }

  public static async generateReferralCode () {
    let code = '';
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 12; i > 0; --i) code += characters[Math.floor(Math.random() * characters.length)];
    const existCode = await CollaboratorModel.scope([{ method: ['byReferral', code] }]).findOne();
    if (existCode) code = await this.generateReferralCode();
    return code;
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
    this.belongsTo(MProvinceModel, { as: 'province', foreignKey: 'provinceId' });
    this.belongsTo(MDistrictModel, { as: 'district', foreignKey: 'districtId' });
    this.belongsTo(MWardModel, { as: 'ward', foreignKey: 'wardId' });
    this.belongsTo(CollaboratorModel, { as: 'parent', foreignKey: 'parentId' });
    this.belongsTo(SellerLevelModel, { as: 'defaultLevel', foreignKey: 'defaultRank' });
    this.belongsTo(SellerLevelModel, { as: 'currentLevel', foreignKey: 'currentRank' });
  }
}

export default CollaboratorModel;
