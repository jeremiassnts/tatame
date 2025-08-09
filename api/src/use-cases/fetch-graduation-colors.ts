import { Injectable } from '@nestjs/common';
import { GraduationColorsRepository } from '../database/repositories/graduation-colors.repository';
import { ModalitiesRepository } from '../database/repositories/modalities.repository';
import { ModalityNotFoundError } from './error/modality-not-found.error';

interface FetchGraduationColorsUseCaseRequest {
  modalityId: string;
}

@Injectable()
export class FetchGraduationColorsUseCase {
  constructor(
    private graduationColorsRepository: GraduationColorsRepository,
    private modalitiesRepository: ModalitiesRepository,
  ) {}

  async execute({ modalityId }: FetchGraduationColorsUseCaseRequest) {
    const modality = await this.modalitiesRepository.findById(modalityId);
    if (!modality) {
      throw new ModalityNotFoundError();
    }

    const colors =
      await this.graduationColorsRepository.findByModalityId(modalityId);
    return { colors };
  }
}
