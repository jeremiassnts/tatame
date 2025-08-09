import { Controller, Get, UseGuards } from '@nestjs/common';
import { FetchClassesByGymUseCase } from 'src/domain/use-cases/fetch-classes-by-gym';
import { JwtAuthGuard } from '../../infra/auth/jwt-auth.guard';
import { CurrentUser } from '../../infra/auth/current-user-decorator';
import { UserPayload } from '../../infra/auth/jwt.strategy';
import { ClassWithDetailsPresenter } from '../../infra/presenters/class-with-details-presenter';

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
