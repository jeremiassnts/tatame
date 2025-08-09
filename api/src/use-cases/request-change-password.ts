import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../database/repositories/users.repository';
import { EnvService } from 'src/env/env.service';
import { MailerService } from '../services/mailer.service';
import { TokenEncrypterService } from '../services/token-encrypter.service';

interface RequestChangePasswordUseCaseRequest {
  email: string;
}
@Injectable()
export class RequestChangePasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private tokenEncrypter: TokenEncrypterService,
    private envService: EnvService,
    private mailerService: MailerService,
  ) {}
  async execute({ email }: RequestChangePasswordUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      return null;
    }
    const token = await this.tokenEncrypter.encrypt(
      { sub: user.id },
      { expiresIn: '1h' },
    );
    const resetURL = `${this.envService.get('API_URL')}reset-password?token=${token}`;
    const body = `
        <h1>Redefinir Senha</h1>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetURL}" target="_blank">${resetURL}</a>
    `;
    await this.mailerService.sendMail(user.email, 'Redefinir Senha', body);
  }
}
