import { Controller, Get, HttpCode, SetMetadata } from '@nestjs/common';
import { FetchModalitiesUseCase } from '../../domain/use-cases/fetch-modalities';
import { ModalityPresenter } from '../presenters/modality-presenter';

@Controller('/modalities')
@SetMetadata('isPublic', true)
export class FetchModalitiesController {
  constructor(private fetchModalities: FetchModalitiesUseCase) {}

  @Get()
  @HttpCode(200)
  async handle() {
    const { modalities } = await this.fetchModalities.execute();
    return {
      modalities: modalities.map((modality) =>
        ModalityPresenter.toHttp(modality),
      ),
    };
  }
}
