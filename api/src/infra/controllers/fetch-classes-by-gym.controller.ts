import { Controller, Get, UseGuards } from '@nestjs/common';
import { FetchClassesByGymUseCase } from 'src/domain/use-cases/fetch-classes-by-gym';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user-decorator';
import { UserPayload } from '../auth/jwt.strategy';
import { ClassWithDetailsPresenter } from '../presenters/class-with-details-presenter';

@Controller('/classes')
@UseGuards(JwtAuthGuard)
export class FetchClassesByGymController {
  constructor(private fetchClassesByGymUseCase: FetchClassesByGymUseCase) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const classes = await this.fetchClassesByGymUseCase.execute({
      userId: user.sub,
    });

    return {
      classes: classes.map((classEntity) =>
        ClassWithDetailsPresenter.toHttp(classEntity),
      ),
    };
  }
}
