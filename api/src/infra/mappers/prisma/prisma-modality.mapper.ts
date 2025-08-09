import { Modality as PrismaModality, Prisma } from '@prisma/client';
import { Modality, TypeOfGraduation } from '../../../domain/entities/modality';

export class PrismaModalityMapper {
  static toDomain(raw: PrismaModality): Modality {
    return new Modality({
      id: raw.id,
      name: raw.name,
      type: raw.type as TypeOfGraduation,
    });
  }

  static toPrisma(modality: Modality): Prisma.ModalityUncheckedCreateInput {
    return {
      id: modality.id,
      name: modality.name,
      type: modality.type,
    };
  }
}
