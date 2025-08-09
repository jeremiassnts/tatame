import { Graduation } from '../../src/domain/entities/graduation';
import { GraduationsRepository } from '../../src/domain/repositories/graduations.repository';

export class InMemoryGraduationsRepository implements GraduationsRepository {
  public graduations: Graduation[] = [];

  async create(graduation: Graduation): Promise<void> {
    this.graduations.push(graduation);
    return Promise.resolve();
  }
}
