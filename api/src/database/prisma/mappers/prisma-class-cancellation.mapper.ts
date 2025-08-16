import {
  ClassCancellation as PrismaClassCancellation,
  Prisma,
} from '@prisma/client';
import { ClassCancellation } from '../../../entities/class-cancellation';

export class PrismaClassCancellationMapper {
  static toDomain(raw: PrismaClassCancellation): ClassCancellation {
    return new ClassCancellation({
      id: raw.id,
      classId: raw.classId,
      referenceDate: raw.referenceDate,
      createdAt: raw.createdAt,
    });
  }

  static toPrisma(
    classCancellation: ClassCancellation,
  ): Prisma.ClassCancellationUncheckedCreateInput {
    return {
      id: classCancellation.id,
      classId: classCancellation.classId,
      referenceDate: classCancellation.referenceDate,
      createdAt: classCancellation.createdAt,
    };
  }
}
