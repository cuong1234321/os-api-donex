import AdminEntity from '@entities/admins';
import AdminInterface from '@interfaces/admins';
import { BelongsToManySetAssociationsMixin, Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem, Transaction, HasManyGetAssociationsMixin } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import settings from '@configs/settings';
import dayjs from 'dayjs';
import MailerService from '@services/mailer';
import randomString from 'randomstring';
import RoleModel from './roles';
import PermissionModel from './permissions';
import PermissionGroupModel from './permissionGroups';
import AdminWarehouseModel from './adminWarehouses';
import WarehouseModel from './warehouses';

class AdminModel extends Model<AdminInterface> implements AdminInterface {
  public id: number;
  public fullName: string;
  public username: string;
  public avatar: string;
  public phoneNumber: string;
  public password: string;
  public confirmPassword?: string;
  public email: string;
  public address: string;
  public dateOfBirth: Date;
  public gender: string;
  public status: string;
  public note: string;
  public forgotPasswordToken: string;
  public forgotPasswordExpireAt: Date;
  public roleId: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly CREATABLE_PARAMETERS = ['fullName', 'username', 'phoneNumber', 'gender', 'email', 'dateOfBirth', 'note', 'roleId',
    { adminWarehouses: ['warehouseId'] }]

  static readonly UPDATABLE_PARAMETERS = ['fullName', 'phoneNumber', 'gender', 'email', 'dateOfBirth', 'note', 'roleId',
    { adminWarehouses: ['warehouseId'] }]

  static readonly ADMIN_UPDATABLE_PARAMETERS = ['fullName', 'username', 'avatar', 'phoneNumber', 'gender', 'email', 'dateOfBirth']
  static readonly GENDER_VN_ENUM = { MALE: 'nam', FEMALE: 'nữ', OTHER: 'khác' }
  static readonly GENDER_ENUM = { MALE: 'male', FEMALE: 'female', OTHER: 'other' }

  public static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' }

  static readonly hooks: Partial<ModelHooks<AdminModel>> = {
    beforeSave (record) {
      if (record.password && record.password !== record.previous('password')) {
        const salt = bcrypt.genSaltSync();
        record.password = bcrypt.hashSync(record.password, salt);
      }
      if (record.username === 'Admin001') { record.roleId = 0; }
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validMatchPassword () {
      if (this.isNewRecord || !this.confirmPassword || this.password === this._previousDataValues.password) return;
      if (this.password !== this.confirmPassword && this._previousDataValues.password !== this.confirmPassword) {
        throw new ValidationErrorItem('Xác nhận mật khẩu không khớp.', 'password', 'validMatchPassword', this.confirmPassword);
      }
    },
    async uniquePhoneNumber () {
      if (this.phoneNumber) {
        const existedRecord = await AdminModel.scope([{ method: ['byPhoneNumber', this.phoneNumber] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Số điện thoại đã được sử dụng.', 'uniquePhoneNumber', 'phoneNumber', this.phoneNumber);
        }
      }
    },
    async uniqueUsername () {
      if (this.username) {
        const existedRecord = await AdminModel.scope([{ method: ['byUsername', this.username] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Tài khoản đã được sử dụng.', 'uniqueUsername', 'username', this.username);
        }
      }
    },
    async uniqueEmail () {
      if (this.email) {
        const existedRecord = await AdminModel.scope([{ method: ['byEmail', this.email] }]).findOne();
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
    async validateRole () {
      if (this.roleId) {
        const role = await RoleModel.findByPk(this.roleId);
        if (!role) throw new ValidationErrorItem('Quyền không hợp lệ', 'validateRole', 'roleId', this.roleId);
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
            { id: { [Op.like]: `%${freeWord || ''}%` } },
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
              Sequelize.literal('(SELECT SUBSTRING_INDEX(fullName, " ", -1) AS last_name  FROM admins WHERE id = AdminModel.id)'),
              'lastName',
            ],
          ],
        },
        order: orderConditions,
      };
    },
    withRole () {
      return {
        include: [{
          model: RoleModel,
          as: 'role',
          include: [
            {
              model: PermissionModel,
              as: 'permissions',
              include: [
                {
                  model: PermissionGroupModel,
                  as: 'group',
                },
              ],
            },
          ],
        }],
      };
    },
    withRoleName () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT title  FROM roles WHERE roles.id = AdminModel.roleId)'),
              'roleName',
            ],
          ],
        },
      };
    },
    withWarehouses () {
      return {
        include: [
          {
            model: WarehouseModel,
            as: 'warehouses',
          },
        ],
      };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    withOrderQuantity (from, to) {
      const conditions = (from && to) ? `AND sub_orders.createdAt BETWEEN "${from}" AND "${to}"` : '';
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal('(SELECT COUNT(*) FROM sub_orders WHERE sub_orders.deletedAt IS NULL AND sub_orders.status = "delivered" AND adminConfirmId = AdminModel.id ' +
              `${conditions})`), 'SIGNED'),
              'orderQuantity',
            ],
          ],
        },
      };
    },
    withProductQuantity (from, to) {
      const conditions = (from && to) ? `AND sub_orders.createdAt BETWEEN "${from}" AND "${to}"` : '';
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(sub_orders.total) FROM sub_orders WHERE sub_orders.deletedAt IS NULL AND sub_orders.status = "delivered" AND adminConfirmId = AdminModel.id' +
              `${conditions})`), 'SIGNED'),
              'productQuantity',
            ],
          ],
        },
      };
    },
    withTotalListedPrice (from, to) {
      const conditions = (from && to) ? `AND sub_orders.createdAt BETWEEN "${from}" AND "${to}"` : '';
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(listedPrice * quantity) FROM order_items WHERE order_items.deletedAt IS NULL AND ' +
              'order_items.subOrderId IN (SELECT id FROM sub_orders WHERE sub_orders.deletedAt IS NULL AND sub_orders.status = "delivered" ' +
              `${conditions} AND ` +
              'sub_orders.adminConfirmId = AdminModel.id))'), 'SIGNED'),
              'totalListedPrice',
            ],
          ],
        },
      };
    },
    withTotalDiscount (from, to) {
      const conditions = (from && to) ? `AND sub_orders.createdAt BETWEEN "${from}" AND "${to}"` : '';
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(order_items.saleCampaignDiscount * order_items.quantity) + SUM(sub_orders.coinDiscount + sub_orders.voucherDiscount + sub_orders.rankDiscount + sub_orders.totalOtherDiscount) FROM order_items ' +
              'INNER JOIN sub_orders ON sub_orders.id = order_items.subOrderId AND sub_orders.status = "delivered" AND sub_orders.deletedAt IS NUll ' +
              `${conditions} WHERE order_items.deletedAt IS NULL AND ` +
              'sub_orders.adminConfirmId = AdminModel.id)'), 'SIGNED'),
              'totalDiscount',
            ],
          ],
        },
      };
    },
    byOrderQuantity (fromValue, toValue, fromDate, toDate) {
      const conditions = (fromDate && toDate) ? `AND sub_orders.createdAt BETWEEN "${fromDate}" AND "${toDate}"` : '';
      return {
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.cast(Sequelize.literal('(SELECT COUNT(*) FROM sub_orders WHERE sub_orders.deletedAt IS NULL AND sub_orders.status = "delivered" AND adminConfirmId = AdminModel.id ' +
            `${conditions})`), 'SIGNED'),
            {
              [Op.between]: [fromValue, toValue],
            }),
          ],
        },
      };
    },
    byTotalListedPrice (fromValue, toValue, fromDate, toDate) {
      const conditions = (fromDate && toDate) ? `AND sub_orders.createdAt BETWEEN "${fromDate}" AND "${toDate}"` : '';
      return {
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.cast(Sequelize.literal('(SELECT SUM(listedPrice * quantity) FROM order_items WHERE order_items.deletedAt IS NULL AND ' +
            'order_items.subOrderId IN (SELECT id FROM sub_orders WHERE sub_orders.deletedAt IS NULL AND sub_orders.status = "delivered" ' +
            `${conditions} AND ` +
            'sub_orders.adminConfirmId = AdminModel.id))'), 'SIGNED'),
            {
              [Op.between]: [fromValue, toValue],
            }),
          ],
        },
      };
    },
    byTotalDiscount (fromValue, toValue, fromDate, toDate) {
      const conditions = (fromDate && toDate) ? `AND sub_orders.createdAt BETWEEN "${fromDate}" AND "${toDate}"` : '';
      return {
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.cast(Sequelize.literal('(SELECT SUM(order_items.saleCampaignDiscount * order_items.quantity) + SUM(sub_orders.coinDiscount + sub_orders.voucherDiscount + sub_orders.rankDiscount + sub_orders.totalOtherDiscount) FROM order_items ' +
            'INNER JOIN sub_orders ON sub_orders.id = order_items.subOrderId AND sub_orders.status = "delivered" AND sub_orders.deletedAt IS NUll ' +
            `${conditions} WHERE order_items.deletedAt IS NULL AND ` +
            'sub_orders.adminConfirmId = AdminModel.id)'), 'SIGNED'),
            {
              [Op.between]: [fromValue, toValue],
            }),
          ],
        },
      };
    },
  }

  public setWarehouses: BelongsToManySetAssociationsMixin<WarehouseModel, number>;
  public getAdminWarehouses: HasManyGetAssociationsMixin<AdminWarehouseModel>;

  public async validPassword (password: string) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      return false;
    }
  }

  public async generateAccessToken () {
    const token = jwt.sign({ id: this.id }, settings.jwt.adminSecret, { expiresIn: settings.jwt.ttl });
    return token;
  };

  public async forgotPassword () {
    const token = (Math.random() * (999999 - 100000) + 100000).toString().slice(0, 6);
    const expireAt = (dayjs().add(settings.forgotPasswordTokenExpiresIn, 'day'));
    await this.update(
      {
        forgotPasswordToken: token,
        forgotPasswordExpireAt: expireAt,
      },
    );
    MailerService.forgotPassWord(this, token);
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

  public async updateWarehouses (attributes: any[], transaction?: Transaction) {
    if (!attributes || !attributes.length) return;
    const adminWarehouses = await WarehouseModel.scope([{ method: ['byId', attributes.map(attribute => attribute.warehouseId)] }]).findAll();
    await this.setWarehouses(adminWarehouses, { transaction });
  }

  public static initialize (sequelize: Sequelize) {
    this.init(AdminEntity, {
      hooks: AdminModel.hooks,
      scopes: AdminModel.scopes,
      validate: AdminModel.validations,
      tableName: 'admins',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(RoleModel, { as: 'role', foreignKey: 'roleId' });
    this.hasMany(AdminWarehouseModel, { as: 'adminWarehouses', foreignKey: 'adminId' });
    this.belongsToMany(WarehouseModel, { through: AdminWarehouseModel, as: 'warehouses', foreignKey: 'adminId' });
  }
}

export default AdminModel;
