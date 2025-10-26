import { Gym } from '../../src/entities/gym';
import { GymsRepository } from '../../src/database/repositories/gyms.repository';

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

  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((gym) => gym.id === id);
    return Promise.resolve(gym || null);
  }

  async update(gym: Gym): Promise<void> {
    const gymIndex = this.gyms.findIndex((g) => g.id === gym.id);
    if (gymIndex >= 0) {
      this.gyms[gymIndex] = gym;
    }
    return Promise.resolve();
  }
}
