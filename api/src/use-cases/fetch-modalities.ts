import { Injectable } from '@nestjs/common';
import { ModalitiesRepository } from '../database/repositories/modalities.repository';

@Injectable()
export class FetchModalitiesUseCase {
  constructor(private modalitiesRepository: ModalitiesRepository) {}

  async execute() {
    const modalities = await this.modalitiesRepository.findAll();
    return { modalities };
  }
}
