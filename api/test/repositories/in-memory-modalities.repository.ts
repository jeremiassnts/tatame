import { ModalitiesRepository } from '../../src/domain/repositories/modalities.repository';
import { Modality } from '../../src/domain/entities/modality';

export class InMemoryModalitiesRepository implements ModalitiesRepository {
  public items: Modality[] = [];

  async create(modality: Modality): Promise<void> {
    this.items.push(modality);
    return Promise.resolve();
  }

  async findAll(): Promise<Modality[]> {
    return Promise.resolve(this.items);
  }

  async findById(id: string): Promise<Modality | null> {
    const modality = this.items.find((item) => item.id === id);
    if (!modality) return null;
    return Promise.resolve(modality);
  }
}
