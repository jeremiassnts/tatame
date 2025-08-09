import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClassWithDetailsPresenter } from '../presenters/class-with-details-presenter';
import { FetchClassByIdUseCase } from 'src/domain/use-cases/fetch-class-by-id';

@Controller('/classes')
@UseGuards(JwtAuthGuard)
export class FetchClassByIdController {
  constructor(private fetchClassByIdUseCase: FetchClassByIdUseCase) {}

  @Get(':id')
  async handle(@Param('id') id: string) {
    const data = await this.fetchClassByIdUseCase.execute({
      classId: id,
    });

    return {
      class: ClassWithDetailsPresenter.toHttp(data),
    };
  }
}
