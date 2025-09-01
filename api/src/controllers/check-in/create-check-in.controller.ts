import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { CreateCheckInUseCase } from 'src/use-cases/create-check-in';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CheckInPresenter } from 'src/database/presenters/check-in-presenter';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { UserPayload } from 'src/auth/jwt.strategy';

export const createCheckInBodySchema = z.object({
  classId: z.string().uuid(),
  referenceDate: z.coerce.date(),
});

type CreateCheckInBodySchema = z.infer<typeof createCheckInBodySchema>;

@Controller('/check-ins')
@UseGuards(JwtAuthGuard)
export class CreateCheckInController {
  constructor(private createCheckIn: CreateCheckInUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() currentUser: UserPayload,
    @Body() body: CreateCheckInBodySchema,
  ) {
    const { classId, referenceDate } = body;
    const { sub: userId } = currentUser;

    const result = await this.createCheckIn.execute({
      classId,
      userId,
      referenceDate: new Date(referenceDate),
    });

    return {
      checkIn: CheckInPresenter.toHttp(result.checkIn),
    };
  }
}
