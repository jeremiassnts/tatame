import { describe, it, expect, beforeEach } from 'vitest';
import { FetchGymsUseCase } from './fetch-gyms';
import { InMemoryGymsRepository } from 'test/repositories/in-memory-gyms.repository';
import { Gym } from '../entities/gym';

describe('Fetch Gyms Use Case', () => {
  let sut: FetchGymsUseCase;
  let gymsRepository: InMemoryGymsRepository;

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchGymsUseCase(gymsRepository);
  });

  it('should fetch gyms', async () => {
    const gym = new Gym({
      name: 'Gym 1',
      address: 'Address 1',
      logo: 'Logo 1',
      since: new Date(),
      managerId: 'manager-id-1',
    });

    gymsRepository.gyms.push(gym);

    const gyms = await sut.execute();

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Gym 1' })]),
    );
  });
});
