import { Modality } from 'src/domain/entities/modality';

export class ModalityPresenter {
  static toHttp({ id, name, type }: Modality) {
    return {
      id,
      name,
      type,
    };
  }
}
