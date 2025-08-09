import { Controller, Delete, Param, UseGuards, HttpCode } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DeleteClassUseCase } from 'src/domain/use-cases/delete-class';

@Controller('/classes/:id')
@UseGuards(JwtAuthGuard)
export class DeleteClassController {
  constructor(private deleteClass: DeleteClassUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') classId: string) {
    await this.deleteClass.execute({
      classId,
    });
  }
}
