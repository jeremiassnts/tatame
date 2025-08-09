import {
  Controller,
  Get,
  Query,
  UsePipes,
  HttpCode,
  SetMetadata,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { z } from 'zod';
import { FindUserByEmailUseCase } from 'src/use-cases/find-user-by-email';

export const FindUserByEmailQuerySchema = z.object({
  email: z.string().email(),
});

export type FindUserByEmailQuerySchema = z.infer<
  typeof FindUserByEmailQuerySchema
>;

@Controller('/users')
@SetMetadata('isPublic', true)
export class FindUserByEmailController {
  constructor(private findUserByEmailUseCase: FindUserByEmailUseCase) {}

  @Get('/check-email')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(FindUserByEmailQuerySchema))
  async handle(@Query() query: FindUserByEmailQuerySchema) {
    const { email } = query;

    const result = await this.findUserByEmailUseCase.execute({
      email,
    });

    return {
      userId: result.userId,
    };
  }
}
