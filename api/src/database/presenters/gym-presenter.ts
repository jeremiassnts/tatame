import { Gym } from 'src/entities/gym';

export class GymPresenter {
  static toHttp(gym: Gym) {
    return {
      id: gym.id,
      name: gym.name,
      address: gym.address,
      logo: gym.logo,
      since: gym.since,
      managerId: gym.managerId,
    };
  }
}
