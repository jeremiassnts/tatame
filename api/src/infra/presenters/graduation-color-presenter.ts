import { GraduationColor } from 'src/domain/entities/graduation-color';

export class GraduationColorPresenter {
  static toHttp({ id, name, modalityId }: GraduationColor) {
    return {
      id,
      name,
      modalityId,
    };
  }
}
