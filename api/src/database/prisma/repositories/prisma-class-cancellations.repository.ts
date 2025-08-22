import { Injectable } from '@nestjs/common';
import { ClassCancellation } from '../../../entities/class-cancellation';
import { ClassCancellationsRepository } from '../../repositories/class-cancellations.repository';
import { PrismaService } from '../prisma.service';
import { PrismaClassCancellationMapper } from '../mappers/prisma-class-cancellation.mapper';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class PrismaClassCancellationsRepository
  implements ClassCancellationsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(classCancellation: ClassCancellation): Promise<void> {
    const data = PrismaClassCancellationMapper.toPrisma(classCancellation);
    await this.prisma.classCancellation.create({ data });
  }

  async findByClassIdAndDate(
    classId: string,
    referenceDate: Date,
  ): Promise<ClassCancellation | null> {
    const start = startOfDay(referenceDate);
    const end = endOfDay(referenceDate);

    const classCancellation = await this.prisma.classCancellation.findFirst({
      where: {
        classId,
        referenceDate: {
          gte: start,
          lte: end,
        },
      },
    });

    if (!classCancellation) {
      return null;
    }

    return PrismaClassCancellationMapper.toDomain(classCancellation);
  }

  async deleteByClassIdAndDate(
    classId: string,
    referenceDate: Date,
  ): Promise<void> {
    const start = startOfDay(referenceDate);
    const end = endOfDay(referenceDate);

    await this.prisma.classCancellation.deleteMany({
      where: {
        classId,
        referenceDate: {
          gte: start,
          lte: end,
        },
      },
    });
  }
}
