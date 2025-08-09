import { TrainingGym } from '../../src/domain/entities/training-gym';
import { TrainingGymsRepository } from '../../src/domain/repositories/training-gyms.repository';

export class InMemoryTrainingGymsRepository implements TrainingGymsRepository {
  public trainingGyms: TrainingGym[] = [];

  async create(trainingGym: TrainingGym): Promise<void> {
    this.trainingGyms.push(trainingGym);
    return Promise.resolve();
  }

  async findByUserId(userId: string): Promise<TrainingGym | null> {
    const trainingGym = this.trainingGyms
      .filter((tg) => tg.userId === userId && !tg.deletedAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
    return Promise.resolve(trainingGym || null);
  }
}
