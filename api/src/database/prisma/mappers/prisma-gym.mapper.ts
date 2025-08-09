import { Gym as PrismaGym, Prisma } from '@prisma/client';
import { Gym } from '../../../entities/gym';

export class PrismaGymMapper {
  static toDomain(raw: PrismaGym): Gym {
    return new Gym({
      id: raw.id,
      name: raw.name,
      address: raw.address,
      managerId: raw.managerId,
      logo: raw.logo,
      since: raw.since ?? new Date(),
    });
  }

  static toPrisma(gym: Gym): Prisma.GymUncheckedCreateInput {
    return {
      id: gym.id,
      name: gym.name,
      address: gym.address,
      managerId: gym.managerId ?? '',
      logo: gym.logo,
      since: gym.since,
    };
  }
}
