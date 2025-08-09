import { Injectable } from '@nestjs/common';
import { TrainingGymsRepository } from '../../../domain/repositories/training-gyms.repository';
import { PrismaService } from './prisma.service';
import { TrainingGym } from '../../../domain/entities/training-gym';

@Injectable()
export class PrismaTrainingGymsRepository implements TrainingGymsRepository {
  constructor(private prisma: PrismaService) {}

  async create(trainingGym: TrainingGym): Promise<void> {
    await this.prisma.trainingGym.create({
      data: {
        id: trainingGym.id,
        userId: trainingGym.userId ?? '',
        gymId: trainingGym.gymId,
        createdAt: trainingGym.createdAt,
        updatedAt: trainingGym.updatedAt,
        deletedAt: trainingGym.deletedAt || undefined,
      },
    });
  }

  async findByUserId(userId: string): Promise<TrainingGym | null> {
    const trainingGym = await this.prisma.trainingGym.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!trainingGym) {
      return null;
    }

    return new TrainingGym({
      id: trainingGym.id,
      userId: trainingGym.userId,
      gymId: trainingGym.gymId,
      createdAt: trainingGym.createdAt,
      updatedAt: trainingGym.updatedAt,
      deletedAt: trainingGym.deletedAt ? trainingGym.deletedAt : undefined,
    });
  }
}
