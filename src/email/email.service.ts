import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodeMailer from 'nodemailer';
import { EmailDto } from './dtos/email.dto';
import { hydrateEmailTemplate } from './html.template';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}
  private transporter = nodeMailer.createTransport({
    host: this.configService.get('EMAIL_HOST'),
    port: 465,
    secure: true,
    auth: {
      user: this.configService.get('EMAIL_USER'),
      pass: this.configService.get('EMAIL_PASSWORD'),
    },
    tls: { rejectUnauthorized: false },
  });
  async sendEmail(hydratedHtml: string) {
    try {
      return this.transporter.sendMail({
        from: ' ContactPatriArchPlus ' + this.configService.get('EMAIL_USER'),
        to: this.configService.get('EMAIL_ENDPOINT'),
        subject: 'Une personne a rempli le formulaire de contact',
        html: hydratedHtml,
      });
    } catch (error) {
      throw new HttpException('Error sending email', 500);
    }
  }
  hydrateTemplate(emailData: EmailDto) {
    return hydrateEmailTemplate(emailData);
  }
}
