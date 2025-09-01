import { Prisma, CheckIn as PrismaCheckIn } from '@prisma/client';
import { CheckIn } from 'src/entities/check-in';

export class PrismaCheckInMapper {
  static toDomain(raw: PrismaCheckIn): CheckIn {
    return new CheckIn({
      id: raw.id,
      classId: raw.classId,
      userId: raw.userId,
      createdAt: raw.createdAt,
      referenceDate: raw.referenceDate,
    });
  }
  static toPrisma(checkIn: CheckIn): Prisma.CheckInUncheckedCreateInput {
    return {
      id: checkIn.id,
      classId: checkIn.classId,
      userId: checkIn.userId,
      createdAt: checkIn.createdAt,
      referenceDate: checkIn.referenceDate,
    };
  }
}
