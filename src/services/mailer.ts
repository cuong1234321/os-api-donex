import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import configs from '@configs/configs';
import Mail from 'nodemailer/lib/mailer';
import handlebars from 'handlebars';
import settings from '@configs/settings';
import AdminInterface from '@interfaces/admins';
import CollaboratorModel from '@models/collaborators';

class MailerService {
  public static async forgotPassWord (admin: AdminInterface, otp: string) {
    const mailerOptions: Mail.Options = {
      from: 'Admin',
      to: admin.email,
      subject: '[DONEX-SPORT] Quên mật khẩu',
    };
    const templateArgs = {
      otp: otp,
      url: `${process.env.ADMIN_HOST}/quen-mat-khau?adminEmail=${admin.email}`,
      name: admin.fullName,
      expireTime: settings.forgotPasswordTokenExpiresIn * 24,
    };
    const templateName = 'forgotPasswordMailer';
    await this.sendMail(mailerOptions, templateName, templateArgs);
  }

  public static async collaboratorForgotPassWord (collaborator: any, otp: string) {
    const mailerOptions: Mail.Options = {
      from: 'Admin',
      to: collaborator.email,
      subject: '[DONEX-SPORT] Quên mật khẩu',
    };
    const templateArgs = {
      otp: otp,
      // url: `${process.env.SELLER_HOST}/quen-mat-khau?adminEmail=${collaborator.email}`,
      name: collaborator.fullName,
      expireTime: settings.forgotPasswordTokenExpiresIn,
    };
    const templateName = 'forgotPasswordMailer';
    await this.sendMail(mailerOptions, templateName, templateArgs);
  }

  public static async sendCollaboratorLoginInfo (collaborator: any, password: string) {
    const mailerOptions: Mail.Options = {
      from: 'Admin',
      to: collaborator.email,
      subject: '[DONEX-SPORT] Thông tin đăng nhập',
    };
    const templateArgs = {
      username: collaborator.username,
      password,
      accountType: collaborator.type === CollaboratorModel.TYPE_ENUM.COLLABORATOR ? 'cộng tác viên' : 'đại lý',
      url: `${process.env.SELLER_HOST}`,
      name: collaborator.fullName,
    };
    const templateName = 'sendCollaboratorLoginInfo';
    await this.sendMail(mailerOptions, templateName, templateArgs);
  }

  public static async sendRejectCollaboratorRequest (collaborator: any) {
    const mailerOptions: Mail.Options = {
      from: 'Admin',
      to: collaborator.email,
      subject: '[DONEX-SPORT] Từ chối đăng ký',
    };
    const templateArgs = {
      accountType: collaborator.type === CollaboratorModel.TYPE_ENUM.COLLABORATOR ? 'cộng tác viên' : 'đại lý',
      rejectionReason: collaborator.rejectionReason,
      name: collaborator.fullName,
    };
    const templateName = 'sendRejectCollaboratorRequest';
    await this.sendMail(mailerOptions, templateName, templateArgs);
  }

  public static async createAdmin (admin: any, passwordDefault: any) {
    const mailerOptions: Mail.Options = {
      from: 'Admin',
      to: admin.email,
      subject: '[DONEX-SPORT] Thông tin tài khoản nhân viên',
    };
    const templateArgs = {
      url: process.env.ADMIN_HOST,
      name: admin.fullName,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
      username: admin.username,
      password: passwordDefault,
    };
    const templateName = 'sendAdminInfo';
    await this.sendMail(mailerOptions, templateName, templateArgs);
  }

  public static async createUser (user: any, passwordDefault: any) {
    const mailerOptions: Mail.Options = {
      from: 'Admin',
      to: user.email,
      subject: '[DONEX-SPORT] Thông tin tài khoản khách hàng',
    };
    const templateArgs = {
      url: process.env.CLIENT_HOST,
      name: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      username: user.username,
      password: passwordDefault,
    };
    const templateName = 'sendAdminInfo';
    await this.sendMail(mailerOptions, templateName, templateArgs);
  }

  public static async changePasswordCollaborator (collaborator: any, password: string) {
    const mailerOptions: Mail.Options = {
      from: 'Admin',
      to: collaborator.email,
      subject: '[DONEX-SPORT] Thay đổi mật khẩu CTV/DL/NPP',
    };
    const host = process.env.COLLABORATOR_HOST;
    await this.sendMailChangePassword(collaborator.fullName, password, mailerOptions, host);
  }

  public static async changePasswordAdmin (admin: any, password: string) {
    const mailerOptions: Mail.Options = {
      from: 'Admin',
      to: admin.email,
      subject: '[DONEX-SPORT] Thay đổi mật khẩu nhân viên',
    };
    const host = process.env.ADMIN_HOST;
    await this.sendMailChangePassword(admin.fullName, password, mailerOptions, host);
  }

  public static async changePasswordUser (user: any, password: string) {
    const mailerOptions: Mail.Options = {
      from: 'Admin',
      to: user.email,
      subject: '[DONEX-SPORT] Thay đổi mật khẩu khách hàng',
    };
    const host = process.env.CLIENT_HOST;
    await this.sendMailChangePassword(user.fullName, password, mailerOptions, host);
  }

  private static async sendMailChangePassword (name: string, password: string, mailerOptions: Mail.Options, host: string) {
    const templateArgs = {
      url: host,
      name,
      password,
    };
    const templateName = 'successChangePasswordAdmin';
    await this.sendMail(mailerOptions, templateName, templateArgs);
  }

  private static async sendMail (args: Mail.Options, templateName: string, templateArgs: any = {}) {
    const transporter = nodemailer.createTransport(configs.mailerTransporter);
    const templateSrc = path.join(__dirname, `../../views/mailer/${templateName}.hbs`);
    const template = handlebars.compile(fs.readFileSync(templateSrc, 'utf-8'));
    const html = template(templateArgs);
    args.html = html;

    await transporter.sendMail(args);
  }
}

export default MailerService;
