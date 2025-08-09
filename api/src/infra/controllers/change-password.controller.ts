import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ChangePasswordUseCase } from 'src/domain/use-cases/change-password';
import { UserPayload } from '../auth/jwt.strategy';
import { CurrentUser } from '../auth/current-user-decorator';

interface ChangePasswordBody {
  password: string;
}

@Controller('/users/change-password')
export class ChangePasswordController {
  constructor(private changePasswordUseCase: ChangePasswordUseCase) {}
  @Post()
  @HttpCode(200)
  async handle(
    @Body() body: ChangePasswordBody,
    @CurrentUser() currentUser: UserPayload,
  ) {
    const { password } = body;

    try {
      await this.changePasswordUseCase.execute({
        userId: currentUser.sub,
        password,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
