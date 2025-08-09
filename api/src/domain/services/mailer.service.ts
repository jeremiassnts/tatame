export abstract class MailerService {
  abstract sendMail(to: string, subject: string, body: string): Promise<void>;
}
