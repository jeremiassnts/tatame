import { GraduationColorsRepository } from '../../src/database/repositories/graduation-colors.repository';
import { GraduationColor } from '../../src/entities/graduation-color';

export class InMemoryGraduationColorsRepository
  implements GraduationColorsRepository
{
  public items: GraduationColor[] = [];

  async create(graduationColor: GraduationColor): Promise<void> {
    this.items.push(graduationColor);
    return Promise.resolve();
  }

  async findByModalityId(modalityId: string): Promise<GraduationColor[]> {
    return Promise.resolve(
      this.items.filter((item) => item.modalityId === modalityId),
    );
  }
}
