import { Modality } from '../entities/modality';

export abstract class ModalitiesRepository {
  abstract create(modality: Modality): Promise<void>;
  abstract findAll(): Promise<Modality[]>;
  abstract findById(id: string): Promise<Modality | null>;
}
