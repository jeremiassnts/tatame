import {
  Controller,
  Put,
  Param,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../infra/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../../infra/auth/jwt-auth.guard';
import { EditClassUseCase } from 'src/domain/use-cases/edit-class';
import { ClassPresenter } from '../../infra/presenters/class-presenter';
import { DayOfWeek } from 'src/domain/entities/class';

const editClassBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  timeStart: z.string().datetime(),
  timeEnd: z.string().datetime(),
  dayOfWeek: z.nativeEnum(DayOfWeek),
  userId: z.string(),
  address: z.string(),
  modalityId: z.string(),
});

type EditClassBodySchema = z.infer<typeof editClassBodySchema>;

@Controller('/classes/:id')
@UseGuards(JwtAuthGuard)
export class EditClassController {
  constructor(private editClass: EditClassUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Param('id') classId: string,
    @Body(new ZodValidationPipe(editClassBodySchema)) body: EditClassBodySchema,
  ) {
    const {
      name,
      description,
      timeStart,
      timeEnd,
      dayOfWeek,
      userId,
      address,
      modalityId,
    } = body;

    const { class: classUpdated } = await this.editClass.execute({
      classId,
      name,
      description,
      timeStart: new Date(timeStart),
      timeEnd: new Date(timeEnd),
      dayOfWeek,
      userId,
      address,
      modalityId,
    });

    return { class: ClassPresenter.toHttp(classUpdated) };
  }
}
