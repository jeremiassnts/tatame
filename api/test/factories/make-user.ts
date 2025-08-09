import { faker } from '@faker-js/faker';
import { User, Gender } from '../../src/entities/user';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaUser(override: Partial<User> = {}) {
    const user = makeUser(override);
    return await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        tier: user.tier,
        authorized: user.authorized,
        birth: user.birth,
        gender: user.gender,
        authToken: user.authToken,
        profilePhotoUrl: user.profilePhotoUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        ...override,
      },
    });
  }
}

export function makeUser(override: Partial<User> = {}) {
  const user = new User({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    tier: faker.helpers.arrayElement(['FREE', 'PREMIUM']),
    authorized: faker.datatype.boolean(),
    birth: faker.date.past(),
    gender: faker.helpers.arrayElement([Gender.MALE, Gender.FEMALE]),
    createdAt: new Date(),
    ...override,
  });

  return user;
}
