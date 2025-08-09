import { UsersRepository } from 'src/domain/repositories/users.repository';
import { PasswordHasherService } from 'src/domain/services/password-hasher.service';
import { Injectable } from '@nestjs/common';
import { TokenEncrypterService } from '../services/token-encrypter.service';
import { WrongCredentialsError } from './error/wrong-credentials.error';

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}
@Injectable()
export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasher: PasswordHasherService,
    private tokenEncrypter: TokenEncrypterService,
  ) {}
  async execute({ email, password }: AuthenticateUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new WrongCredentialsError();
    }

    const isPasswordValid = await this.passwordHasher.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new WrongCredentialsError();
    }

    const accessToken = await this.tokenEncrypter.encrypt({
      sub: user.id,
    });

    return {
      accessToken,
    };
  }
}
