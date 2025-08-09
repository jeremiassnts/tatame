import {
  Controller,
  Get,
  HttpCode,
  Param,
  HttpException,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { FetchGraduationColorsUseCase } from '../../use-cases/fetch-graduation-colors';
import { GraduationColorPresenter } from '../../database/presenters/graduation-color-presenter';
import { ModalityNotFoundError } from '../../use-cases/error/modality-not-found.error';

@Controller('/modalities/:modalityId/colors')
@SetMetadata('isPublic', true)
export class FetchGraduationColorsController {
  constructor(private fetchGraduationColors: FetchGraduationColorsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('modalityId') modalityId: string) {
    try {
      const { colors } = await this.fetchGraduationColors.execute({
        modalityId,
      });

      return {
        colors: colors.map((color) => GraduationColorPresenter.toHttp(color)),
      };
    } catch (error) {
      if (error instanceof ModalityNotFoundError) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }
}
