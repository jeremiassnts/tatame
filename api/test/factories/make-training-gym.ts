import { faker } from '@faker-js/faker';
import { TrainingGym } from '../../src/entities/training-gym';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrainingGymFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTrainingGym(override: Partial<TrainingGym> = {}) {
    const trainingGym = makeTrainingGym(override);
    return await this.prisma.trainingGym.create({
      data: {
        id: trainingGym.id,
        userId: trainingGym.userId,
        gymId: trainingGym.gymId,
        createdAt: trainingGym.createdAt,
        updatedAt: trainingGym.updatedAt,
        deletedAt: trainingGym.deletedAt,
        ...override,
      },
    });
  }
}

export function makeTrainingGym(override: Partial<TrainingGym> = {}) {
  const trainingGym = new TrainingGym({
    userId: faker.string.uuid(),
    gymId: faker.string.uuid(),
    ...override,
  });

  return trainingGym;
}
