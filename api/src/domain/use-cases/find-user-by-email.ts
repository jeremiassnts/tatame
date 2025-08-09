import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/domain/repositories/users.repository';

interface FindUserByEmailUseCaseRequest {
  email: string;
}

interface FindUserByEmailUseCaseResponse {
  userId: string | null;
}

@Injectable()
export class FindUserByEmailUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    request: FindUserByEmailUseCaseRequest,
  ): Promise<FindUserByEmailUseCaseResponse> {
    const { email } = request;

    const user = await this.usersRepository.findByEmail(email);

    return {
      userId: user?.id ?? null,
    };
  }
}
