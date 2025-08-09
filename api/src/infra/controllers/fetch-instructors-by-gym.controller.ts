import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserPresenter } from '../presenters/user-presenter';
import { FetchInstructorsByGymUseCase } from 'src/domain/use-cases/fetch-instructors-by-gym';

@Controller('/gyms/:gymId/instructors')
@UseGuards(JwtAuthGuard)
export class FetchInstructorsByGymController {
  constructor(private fetchInstructorsByGym: FetchInstructorsByGymUseCase) {}

  @Get()
  async handle(@Param('gymId') gymId: string) {
    const { instructors } = await this.fetchInstructorsByGym.execute({
      gymId,
    });

    return {
      instructors: instructors.map((user) => UserPresenter.toHttp(user)),
    };
  }
}
