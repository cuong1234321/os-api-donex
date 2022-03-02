import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import configs from '@configs/configs';
import Mail from 'nodemailer/lib/mailer';
import handlebars from 'handlebars';

class MailerService {
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
