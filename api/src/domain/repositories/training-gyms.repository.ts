import { TrainingGym } from '../entities/training-gym';

export abstract class TrainingGymsRepository {
  abstract create(trainingGym: TrainingGym): Promise<void>;
  abstract findByUserId(userId: string): Promise<TrainingGym | null>;
}
