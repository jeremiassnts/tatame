import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailerService } from 'src/services/mailer.service';
import { EnvService } from 'src/env/env.service';

@Injectable()
export class NodemailerService implements MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private envService: EnvService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: this.envService.get('GOOGLE_EMAIL'),
        clientId: this.envService.get('GOOGLE_CLIENT_ID'),
        clientSecret: this.envService.get('GOOGLE_CLIENT_SECRET'),
        refreshToken: this.envService.get('GOOGLE_REFRESH_TOKEN'),
        accessToken: this.envService.get('GOOGLE_ACCESS_TOKEN'),
        expires: 3599,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.envService.get('GOOGLE_EMAIL'),
      to,
      subject,
      html,
    });
  }
}
