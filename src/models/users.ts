import UserEntity from '@entities/users';
import UserInterface from '@interfaces/users';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import settings from '@configs/settings';
import dayjs from 'dayjs';
import SendSmsService from '@services/smsSender';
import randomString from 'randomstring';
import VoucherApplicationModel from './voucherApplications';
import VoucherModel from './vouchers';

class UserModel extends Model<UserInterface> implements UserInterface {
  public id: number;
  public adminId: number;
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
  public gender: string;
  public status: string;
  public note: string;
  public defaultRank: string;
  public currentRank: number;
  public forgotPasswordToken: string;
  public forgotPasswordExpireAt: Date;
  public avatar: string;
  public rank: string;
  public coinReward: number;
  public alreadyFinishOrder: boolean;
  public isBlackList: boolean;
  public lastOrderFinishedAt: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' }
  public static readonly RANK_ENUM = { BASIC: 'Basic', VIP: 'Vip' }
  public static readonly CREATABLE_PARAMETERS = ['phoneNumber', 'fullName', 'password', 'confirmPassword']
  public static readonly USER_CREATABLE_PARAMETERS = ['phoneNumber', 'fullName', 'username', 'gender', 'dateOfBirth', 'email', 'note']
  public static readonly USER_UPDATABLE_PARAMETERS = ['fullName', 'dateOfBirth', 'provinceId', 'districtId', 'wardId', 'address', 'email']
  static readonly UPDATABLE_PARAMETERS = ['fullName', 'phoneNumber', 'gender', 'email', 'dateOfBirth', 'note', 'defaultRank']

  public static readonly CREATABLE_COLLABORATOR_PARAMETERS = ['phoneNumber', 'fullName', 'email', 'provinceId', 'districtId', 'wardId', 'address', 'dateOfBirth',
    { collaborator: ['type', 'lat', 'long', 'title'] },
  ]

  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'coinReward']

  static readonly hooks: Partial<ModelHooks<UserModel>> = {
    beforeSave (record) {
      if (record.password && record.password !== record.previous('password')) {
        const salt = bcrypt.genSaltSync();
        record.password = bcrypt.hashSync(record.password, salt);
      }
    },
  }

  static readonly validations: ModelValidateOptions = {
    async uniquePhoneNumber () {
      if (this.phoneNumber) {
        const existedRecord = await UserModel.findOne({
          attributes: ['id'], where: { phoneNumber: this.phoneNumber },
        });
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Số điện thoại đã được sử dụng.', 'uniquePhoneNumber', 'phoneNumber', this.phoneNumber);
        }
      }
    },
    async validMatchPassword () {
      if (!this.confirmPassword || this.password === this._previousDataValues.password) return;
      if (this.password !== this.confirmPassword && this._previousDataValues.password !== this.confirmPassword) {
        throw new ValidationErrorItem('Xác nhận mật khẩu không khớp.', 'password', 'validMatchPassword', this.confirmPassword);
      }
    },
    async uniqueUsername () {
      if (this.username) {
        const existedRecord = await UserModel.scope([{ method: ['byUsername', this.username] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Tài khoản đã được sử dụng.', 'uniqueUsername', 'username', this.username);
        }
      }
    },
    async uniqueEmail () {
      if (this.email) {
        const existedRecord = await UserModel.scope([{ method: ['byEmail', this.email] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Email đã được sử dụng.', 'uniqueEmail', 'email', this.email);
        }
      }
    },
    async validatePhoneNumber () {
      if (this.phoneNumber && !settings.phonePattern.test(this.phoneNumber)) {
        throw new ValidationErrorItem('Số điện thoại không hợp lệ', 'validatePhoneNumber', 'phoneNumber', this.phoneNumber);
      }
    },
    async validateEmail () {
      if (this.email && !settings.emailPattern.test(this.email)) {
        throw new ValidationErrorItem('Email không hợp lệ', 'validateEmail', 'email', this.email);
      }
    },
    async validateStatus () {
      if (this.deletedAt && this.status !== UserModel.STATUS_ENUM.INACTIVE) {
        throw new ValidationErrorItem('Không đựợc xóa người dùng trong trạng thái hoạt động', 'validStatus', 'status', this.status);
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
    byId (id) {
      return {
        where: { id },
      };
    },
    byPhoneNumber (phoneNumber) {
      return {
        where: { phoneNumber },
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
    byStatus (status) {
      return {
        where: { status },
      };
    },
    byGender (gender) {
      return {
        where: { gender },
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
      orderConditions.push([Sequelize.literal('createdAt'), 'DESC']);
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT SUBSTRING_INDEX(fullName, " ", -1) AS last_name  FROM users WHERE id = UserModel.id)'),
              'lastName',
            ],
          ],
        },
        order: orderConditions,
      };
    },
    addressInfo () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT title FROM m_provinces WHERE m_provinces.id = UserModel.provinceId)'),
              'provinceTitle',
            ],
            [
              Sequelize.literal('(SELECT title FROM m_districts WHERE m_districts.id = UserModel.districtId)'),
              'districtTitle',
            ],
            [
              Sequelize.literal('(SELECT title FROM m_wards WHERE m_wards.id = UserModel.wardId)'),
              'wardTitle',
            ],
          ],
        },
      };
    },
    byBirthDay () {
      return {
        where: {
          id: { [Op.in]: Sequelize.literal('(SELECT id FROM users WHERE DATE_FORMAT(dateOfBirth, "%m-%d") = date_format(CURDATE(), "%m-%d"))') },
        },
      };
    },
    withAlreadyFinishOrder () {
      return {
        where: { alreadyFinishOrder: true },
      };
    },
    withNotFinishAnyOrder () {
      return {
        where: { alreadyFinishOrder: false },
      };
    },
    lastOrderOutOfDate () {
      return {
        where: {
          id: { [Op.in]: Sequelize.literal(`(SELECT id FROM users WHERE DATE_ADD(lastOrderFinishedAt, INTERVAL ${settings.orderOutOfDate} DAY) <  CURDATE())`) },
        },
      };
    },
    isNotBlackList () {
      return {
        where: {
          isBlackList: false,
        },
      };
    },
    byCoinReward (coinReward) {
      return {
        where: {
          coinReward,
        },
      };
    },
    byMoreThanCoinReward (coinReward) {
      return {
        where: {
          coinReward: {
            [Op.gt]:
          coinReward,
          },
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

  public async sendOtp () {
    const token = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
    const expireAt = (dayjs().add(settings.forgotPasswordTokenExpiresIn, 'day'));
    await this.update(
      {
        forgotPasswordToken: token,
        forgotPasswordExpireAt: expireAt,
      },
    );
    await SendSmsService.sendAuthenticateOtp(this.phoneNumber, token);
  }

  public async checkValidForgotPasswordToken (token: string) {
    return this.forgotPasswordToken === token && (!this.forgotPasswordExpireAt || dayjs(this.forgotPasswordExpireAt).subtract(dayjs().valueOf(), 'ms').valueOf() > 0);
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

  public async generateAccessToken () {
    const token = jwt.sign({ id: this.id }, settings.jwt.userSecret, { expiresIn: settings.jwt.ttl });
    return token;
  };

  public static initialize (sequelize: Sequelize) {
    this.init(UserEntity, {
      hooks: UserModel.hooks,
      scopes: UserModel.scopes,
      validate: UserModel.validations,
      tableName: 'users',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
    this.belongsToMany(VoucherApplicationModel, {
      through: VoucherModel,
      as: 'userVouchers',
      foreignKey: 'recipientId',
      scope: { recipientType: VoucherModel.RECIPIENT_TYPE_ENUM.USER },
    });
  }
}

export default UserModel;
