import { Gym } from '../../src/domain/entities/gym';
import { GymsRepository } from '../../src/domain/repositories/gyms.repository';

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async create(gym: Gym): Promise<void> {
    this.gyms.push(gym);
    return Promise.resolve();
  }

  async findAll(): Promise<Gym[]> {
    return Promise.resolve(this.gyms);
  }

  async findByManagerId(managerId: string): Promise<Gym | null> {
    const gym = this.gyms.find((gym) => gym.managerId === managerId);
    return Promise.resolve(gym || null);
  }
}
