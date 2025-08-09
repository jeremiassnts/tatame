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
import { CreateManagerUseCase } from '../../domain/use-cases/create-manager';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { z } from 'zod';
import { UserAlreadyExistsError } from '../../domain/use-cases/error/user-already-exists.error';
import { Gender } from '../../domain/entities/user';
import { UserPresenter } from '../presenters/user-presenter';
import { GymPresenter } from '../presenters/gym-presenter';

export const createManagerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  gender: z.nativeEnum(Gender),
  birth: z.coerce.date(),
  isInstructor: z.boolean(),
  gymName: z.string(),
  gymAddress: z.string(),
  gymLogo: z.string(),
  gymSince: z.coerce.date(),
  authToken: z.string().optional(),
  profilePhotoUrl: z.string().optional(),
  customerId: z.string(),
  graduations: z.array(
    z.object({
      colorId: z.string(),
      modalityId: z.string(),
      extraInfo: z.string(),
    }),
  ),
});

export type CreateManagerBodySchema = z.infer<typeof createManagerBodySchema>;

@Controller('/managers')
@SetMetadata('isPublic', true)
export class CreateManagerController {
  constructor(private createManagerUseCase: CreateManagerUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createManagerBodySchema))
  async handle(@Body() body: CreateManagerBodySchema) {
    try {
      const result = await this.createManagerUseCase.execute(body);
      return {
        user: UserPresenter.toHttp(result.user),
        gym: GymPresenter.toHttp(result.gym),
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
