import {
  Body,
  Controller,
  HttpCode,
  Post,
  HttpException,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { CreateStudentUseCase } from '../../use-cases/create-student';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { z } from 'zod';
import { UserAlreadyExistsError } from '../../use-cases/error/user-already-exists.error';
import { Gender } from '../../entities/user';
import { UserPresenter } from '../../database/presenters/user-presenter';

export const createStudentBodySchema = z.object({
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

type CreateStudentBodySchema = z.infer<typeof createStudentBodySchema>;

@Controller('students')
export class CreateStudentController {
  constructor(private createStudent: CreateStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @SetMetadata('isPublic', true)
  async handle(
    @Body(new ZodValidationPipe(createStudentBodySchema))
    body: CreateStudentBodySchema,
  ) {
    try {
      const { user } = await this.createStudent.execute(body);

      return { user: UserPresenter.toHttp(user) };
    } catch (err) {
      if (err instanceof UserAlreadyExistsError) {
        throw new HttpException(err.message, HttpStatus.CONFLICT);
      }

      throw err;
    }
  }
}
