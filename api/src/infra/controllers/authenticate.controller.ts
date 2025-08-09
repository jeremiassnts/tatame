import {
  Body,
  Controller,
  HttpCode,
  Post,
  SetMetadata,
  UsePipes,
} from '@nestjs/common';
import { AuthenticateUseCase } from '../../domain/use-cases/authenticate';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { WrongCredentialsError } from '../../domain/use-cases/error/wrong-credentials.error';
import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { z } from 'zod';
import { addDays } from 'date-fns';

export const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
@SetMetadata('isPublic', true)
export class AuthenticateController {
  constructor(private authenticateUseCase: AuthenticateUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    try {
      const { accessToken } = await this.authenticateUseCase.execute({
        email: body.email,
        password: body.password,
      });

      return { accessToken, expiresIn: addDays(new Date(), 365).toISOString() };
    } catch (error) {
      if (error instanceof WrongCredentialsError) {
        throw new HttpException(
          'Credenciais inválidas',
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw error;
    }
  }
}
