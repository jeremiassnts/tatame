import { Graduation as PrismaGraduation, Prisma } from '@prisma/client';
import { Graduation } from '../../../entities/graduation';

export class PrismaGraduationMapper {
  static toDomain(raw: PrismaGraduation): Graduation {
    return new Graduation({
      id: raw.id,
      colorId: raw.colorId,
      userId: raw.userId,
      extraInfo: raw.extraInfo ?? '',
    });
  }

  static toPrisma(
    graduation: Graduation,
  ): Prisma.GraduationUncheckedCreateInput {
    return {
      id: graduation.id,
      colorId: graduation.colorId ?? '',
      userId: graduation.userId ?? '',
      extraInfo: graduation.extraInfo ?? '',
    };
  }
}
