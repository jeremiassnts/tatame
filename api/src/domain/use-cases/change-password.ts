import { UsersRepository } from 'src/domain/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { PasswordHasherService } from '../services/password-hasher.service';
import { UserNotFoundError } from './error/user-not-found.error';

interface ChangePasswordUseCaseRequest {
  userId: string;
  password: string;
}
@Injectable()
export class ChangePasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasher: PasswordHasherService,
  ) {}
  async execute({ userId, password }: ChangePasswordUseCaseRequest) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    const hashedPassword = await this.passwordHasher.hash(password);
    await this.usersRepository.changePassword(userId, hashedPassword);
  }
}
