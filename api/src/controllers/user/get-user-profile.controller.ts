import { Controller, Get, HttpCode, BadRequestException } from '@nestjs/common';
import { GetUserProfileUseCase } from 'src/domain/use-cases/get-user-profile';
import { UserProfilePresenter } from '../../infra/presenters/user-profile-presenter';
import { CurrentUser } from '../../infra/auth/current-user-decorator';
import { UserNotFoundError } from 'src/domain/use-cases/error/user-not-found.error';

interface UserPayload {
  sub: string;
}

@Controller('/users')
export class GetUserProfileController {
  constructor(private getUserProfileUseCase: GetUserProfileUseCase) {}

  @Get('/profile')
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const { sub: userId } = user;

    try {
      const result = await this.getUserProfileUseCase.execute({
        userId,
      });

      return {
        userProfile: UserProfilePresenter.toHttp(result.userProfile),
      };
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
