import { Injectable } from '@nestjs/common';
import { ClassCancellation } from '../../../entities/class-cancellation';
import { ClassCancellationsRepository } from '../../repositories/class-cancellations.repository';
import { PrismaService } from '../prisma.service';
import { PrismaClassCancellationMapper } from '../mappers/prisma-class-cancellation.mapper';

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
    const classCancellation = await this.prisma.classCancellation.findFirst({
      where: {
        classId,
        referenceDate,
      },
    });

    if (!classCancellation) {
      return null;
    }

    return PrismaClassCancellationMapper.toDomain(classCancellation);
  }
}
