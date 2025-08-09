import { MailerService } from 'src/domain/services/mailer.service';

export class FakeMailerService implements MailerService {
  sendMail(to: string, subject: string, body: string): Promise<void> {
    console.log(to, subject, body);
    return Promise.resolve();
  }
}
