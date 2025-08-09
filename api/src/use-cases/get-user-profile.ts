import { Injectable } from '@nestjs/common';
import {
  UsersRepository,
  UserProfileData,
} from 'src/database/repositories/users.repository';
import { UserNotFoundError } from './error/user-not-found.error';

interface GetUserProfileUseCaseRequest {
  userId: string;
}

interface GetUserProfileUseCaseResponse {
  userProfile: UserProfileData;
}

@Injectable()
export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    request: GetUserProfileUseCaseRequest,
  ): Promise<GetUserProfileUseCaseResponse> {
    const { userId } = request;

    const userProfile =
      await this.usersRepository.findByIdWithRelations(userId);

    if (!userProfile) {
      throw new UserNotFoundError();
    }

    return {
      userProfile,
    };
  }
}
