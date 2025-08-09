import { GraduationColor } from 'src/entities/graduation-color';

export class GraduationColorPresenter {
  static toHttp({ id, name, modalityId }: GraduationColor) {
    return {
      id,
      name,
      modalityId,
    };
  }
}
