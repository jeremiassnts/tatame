import { Controller, Get, SetMetadata } from '@nestjs/common';
import { FetchGymsUseCase } from 'src/use-cases/fetch-gyms';
import { GymPresenter } from '../../database/presenters/gym-presenter';

@Controller('gyms')
@SetMetadata('isPublic', true)
export class FetchGymsController {
  constructor(private fetchGyms: FetchGymsUseCase) {}

  @Get()
  async handle() {
    const gyms = await this.fetchGyms.execute();
    return { gyms: gyms.map((gym) => GymPresenter.toHttp(gym)) };
  }
}
