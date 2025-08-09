import { GraduationColor } from '../entities/graduation-color';

export abstract class GraduationColorsRepository {
  abstract create(graduationColor: GraduationColor): Promise<void>;
  abstract findByModalityId(modalityId: string): Promise<GraduationColor[]>;
}
