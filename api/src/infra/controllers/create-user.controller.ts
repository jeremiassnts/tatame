import {
  Body,
  Controller,
  HttpCode,
  Post,
  SetMetadata,
  UsePipes,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { z } from 'zod';
import { UserAlreadyExistsError } from '../../domain/use-cases/error/user-already-exists.error';
import { Gender } from '../../domain/entities/user';
import { UserPresenter } from '../presenters/user-presenter';
import { CreateUserUseCase } from 'src/domain/use-cases/create-user';
import { Role } from 'src/domain/entities/user-role';

export const CreateUserBodySchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().min(6),
  gender: z.nativeEnum(Gender),
  birth: z.coerce.date(),
  authToken: z.string().optional(),
  profilePhotoUrl: z.string().optional(),
  role: z.nativeEnum(Role),
  graduations: z.array(
    z.object({
      colorId: z.string(),
      modalityId: z.string(),
      extraInfo: z.string(),
    }),
  ),
});

export type CreateUserBodySchema = z.infer<typeof CreateUserBodySchema>;

@Controller('/users')
@SetMetadata('isPublic', true)
export class CreateUserController {
  constructor(private CreateUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(CreateUserBodySchema))
  async handle(@Body() body: CreateUserBodySchema) {
    try {
      const result = await this.CreateUserUseCase.execute(body);
      return {
        user: UserPresenter.toHttp(result.user),
      };
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new HttpException(
          'Esse email já está sendo usado',
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }
}
