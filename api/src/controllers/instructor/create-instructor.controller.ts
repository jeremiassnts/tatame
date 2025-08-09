import {
  Body,
  Controller,
  HttpCode,
  Post,
  HttpException,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { CreateInstructorUseCase } from '../../domain/use-cases/create-instructor';
import { ZodValidationPipe } from '../../infra/pipes/zod-validation.pipe';
import { z } from 'zod';
import { UserAlreadyExistsError } from '../../domain/use-cases/error/user-already-exists.error';
import { Gender } from '../../domain/entities/user';
import { UserPresenter } from '../../infra/presenters/user-presenter';

export const createInstructorBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  gender: z.nativeEnum(Gender),
  birth: z.coerce.date(),
  gymId: z.string(),
  authToken: z.string().optional(),
  profilePhotoUrl: z.string().optional(),
  graduations: z.array(
    z.object({
      colorId: z.string(),
      modalityId: z.string(),
      extraInfo: z.string(),
    }),
  ),
});

type CreateInstructorBodySchema = z.infer<typeof createInstructorBodySchema>;

@Controller('instructors')
export class CreateInstructorController {
  constructor(private createInstructor: CreateInstructorUseCase) {}

  @Post()
  @HttpCode(201)
  @SetMetadata('isPublic', true)
  async handle(
    @Body(new ZodValidationPipe(createInstructorBodySchema))
    body: CreateInstructorBodySchema,
  ) {
    try {
      const { user } = await this.createInstructor.execute(body);

      return { user: UserPresenter.toHttp(user) };
    } catch (err) {
      if (err instanceof UserAlreadyExistsError) {
        throw new HttpException(err.message, HttpStatus.CONFLICT);
      }

      throw err;
    }
  }
}
