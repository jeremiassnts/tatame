import {
  GraduationColor as PrismaGraduationColor,
  Prisma,
} from '@prisma/client';
import { GraduationColor } from '../../../entities/graduation-color';

export class PrismaGraduationColorMapper {
  static toDomain(raw: PrismaGraduationColor): GraduationColor {
    return new GraduationColor({
      id: raw.id,
      name: raw.name,
      modalityId: raw.modalityId,
    });
  }

  static toPrisma(
    graduationColor: GraduationColor,
  ): Prisma.GraduationColorUncheckedCreateInput {
    return {
      id: graduationColor.id,
      name: graduationColor.name,
      modalityId: graduationColor.modalityId,
    };
  }
}
