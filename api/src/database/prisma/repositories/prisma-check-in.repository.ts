import { Injectable } from '@nestjs/common';
import { CheckInRepository } from '../../repositories/check-in.repository';
import { PrismaService } from '../prisma.service';
import { CheckIn } from 'src/entities/check-in';
import { PrismaCheckInMapper } from '../mappers/prisma-check-in.mapper';

@Injectable()
export class PrismaCheckInRepository implements CheckInRepository {
  constructor(private prisma: PrismaService) {}

  async create(checkIn: CheckIn): Promise<void> {
    const data = PrismaCheckInMapper.toPrisma(checkIn);
    await this.prisma.checkIn.create({ data });
  }

  async findByClassId(classId: string): Promise<CheckIn[]> {
    const checkIns = await this.prisma.checkIn.findMany({ where: { classId } });
    const result = checkIns.map((checkIn) =>
      PrismaCheckInMapper.toDomain(checkIn),
    );
    return result;
  }

  async findByClassIdAndUserId(
    classId: string,
    userId: string,
  ): Promise<CheckIn | null> {
    const checkIn = await this.prisma.checkIn.findFirst({
      where: { classId, userId },
    });
    return checkIn ? PrismaCheckInMapper.toDomain(checkIn) : null;
  }

  async findByClassIdUserIdAndReferenceDate(
    classId: string,
    userId: string,
    referenceDate: Date,
  ): Promise<CheckIn | null> {
    const checkIn = await this.prisma.checkIn.findFirst({
      where: {
        classId,
        userId,
        referenceDate: {
          gte: new Date(
            referenceDate.getFullYear(),
            referenceDate.getMonth(),
            referenceDate.getDate(),
          ),
          lt: new Date(
            referenceDate.getFullYear(),
            referenceDate.getMonth(),
            referenceDate.getDate() + 1,
          ),
        },
      },
    });
    return checkIn ? PrismaCheckInMapper.toDomain(checkIn) : null;
  }

  async deleteByClassIdAndUserId(
    classId: string,
    userId: string,
  ): Promise<void> {
    await this.prisma.checkIn.deleteMany({ where: { classId, userId } });
  }
}
