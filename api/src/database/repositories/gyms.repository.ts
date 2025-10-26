import { Gym } from '../../entities/gym';

export abstract class GymsRepository {
  abstract create(gym: Gym): Promise<void>;
  abstract findAll(): Promise<Gym[]>;
  abstract findByManagerId(managerId: string): Promise<Gym | null>;
  abstract findById(id: string): Promise<Gym | null>;
  abstract update(gym: Gym): Promise<void>;
}
