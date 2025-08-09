import { faker } from '@faker-js/faker';
import { Gym } from '../../src/entities/gym';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GymFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaGym(override: Partial<Gym> = {}) {
    const gym = makeGym(override);
    return await this.prisma.gym.create({
      data: {
        name: gym.name,
        address: gym.address,
        managerId: gym.managerId ?? '',
        logo: gym.logo,
        since: gym.since,
        ...override,
      },
    });
  }
}

export function makeGym(override: Partial<Gym> = {}) {
  const gym = new Gym({
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    managerId: faker.string.uuid(),
    logo: faker.image.url(),
    since: faker.date.past(),
    ...override,
  });

  return gym;
}
