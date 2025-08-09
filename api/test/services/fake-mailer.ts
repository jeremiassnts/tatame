import { MailerService } from 'src/services/mailer.service';

export class FakeMailerService implements MailerService {
  sendMail(to: string, subject: string, body: string): Promise<void> {
    console.log(to, subject, body);
    return Promise.resolve();
  }
}
