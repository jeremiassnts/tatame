import {
  Controller,
  Body,
  UseGuards,
  HttpCode,
  BadRequestException,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CancelClassUseCase } from 'src/use-cases/cancel-class';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { ClassNotFoundError } from 'src/use-cases/error/class-not-found.error';
import { ClassAlreadyCancelledError } from 'src/use-cases/error/class-already-cancelled.error';

const CancelClassBody = z.object({
  referenceDate: z.coerce.date(),
  classId: z.string(),
});

type CancelClassBody = z.infer<typeof CancelClassBody>;

@Controller('/classes')
@UseGuards(JwtAuthGuard)
export class CancelClassController {
  constructor(private cancelClass: CancelClassUseCase) {}

  @Post('cancel')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(CancelClassBody))
  async handle(@Body() body: CancelClassBody) {
    try {
      const { referenceDate, classId } = body;
      await this.cancelClass.execute({
        classId,
        referenceDate,
      });
    } catch (error) {
      if (error instanceof ClassNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof ClassAlreadyCancelledError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
