import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  SetMetadata,
} from '@nestjs/common';
import { RequestChangePasswordUseCase } from 'src/domain/use-cases/request-change-password';

interface RequestChangePasswordBody {
  email: string;
}

@Controller('/users/request-change-password')
export class RequestChangePasswordController {
  constructor(
    private requestChangePasswordUseCase: RequestChangePasswordUseCase,
  ) {}

  @Post()
  @HttpCode(204)
  @SetMetadata('isPublic', true)
  async handle(@Body() body: RequestChangePasswordBody) {
    const { email } = body;

    try {
      await this.requestChangePasswordUseCase.execute({
        email,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
