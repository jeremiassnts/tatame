import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { z } from 'zod';
import { CreateClassUseCase } from 'src/domain/use-cases/create-class';
import { DayOfWeek } from 'src/domain/entities/class';
import { ClassPresenter } from '../presenters/class-presenter';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export const CreateClassBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  timeStart: z.coerce.date(),
  timeEnd: z.coerce.date(),
  daysOfWeek: z.array(z.nativeEnum(DayOfWeek)),
  address: z.string(),
  gymId: z.string().uuid(),
  userId: z.string().uuid(),
  modalityId: z.string().uuid(),
});

type CreateClassBodySchema = z.infer<typeof CreateClassBodySchema>;

@Controller('/classes')
@UseGuards(JwtAuthGuard)
export class CreateClassController {
  constructor(private createClass: CreateClassUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(CreateClassBodySchema))
  async handle(@Body() body: CreateClassBodySchema) {
    const {
      name,
      description,
      timeStart,
      timeEnd,
      daysOfWeek,
      address,
      gymId,
      userId,
      modalityId,
    } = body;

    const result = await this.createClass.execute({
      name,
      description,
      timeStart,
      timeEnd,
      daysOfWeek,
      address,
      gymId,
      userId,
      modalityId,
    });

    return {
      classes: result.classes.map((classEntity) =>
        ClassPresenter.toHttp(classEntity),
      ),
    };
  }
}
