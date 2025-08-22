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
import { UncancelClassUseCase } from 'src/use-cases/uncancel-class';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { ClassNotFoundError } from 'src/use-cases/error/class-not-found.error';
import { ClassNotCancelledError } from 'src/use-cases/error/class-not-cancelled.error';

const UncancelClassBody = z.object({
  referenceDate: z.coerce.date(),
  classId: z.string(),
});

type UncancelClassBody = z.infer<typeof UncancelClassBody>;

@Controller('/classes')
@UseGuards(JwtAuthGuard)
export class UncancelClassController {
  constructor(private uncancelClass: UncancelClassUseCase) {}

  @Post('uncancel')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(UncancelClassBody))
  async handle(@Body() body: UncancelClassBody) {
    try {
      const { referenceDate, classId } = body;
      await this.uncancelClass.execute({
        classId,
        referenceDate,
      });
    } catch (error) {
      if (error instanceof ClassNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof ClassNotCancelledError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
