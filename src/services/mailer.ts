import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import configs from '@configs/configs';
import Mail from 'nodemailer/lib/mailer';
import handlebars from 'handlebars';
import settings from '@configs/settings';
import AdminInterface from '@interfaces/admins';

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
