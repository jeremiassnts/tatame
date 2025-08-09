import { Injectable } from '@nestjs/common';
import { GymsRepository } from '../repositories/gyms.repository';
import { Gym } from '../entities/gym';

@Injectable()
export class FetchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute(): Promise<Gym[]> {
    const gyms = await this.gymsRepository.findAll();
    return gyms.sort((a, b) => a.name.localeCompare(b.name));
  }
}
