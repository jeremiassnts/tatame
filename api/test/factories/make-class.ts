import { faker } from '@faker-js/faker';
import { Class, DayOfWeek } from '../../src/domain/entities/class';
import { PrismaService } from 'src/infra/repositories/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Class as PrismaClass } from '@prisma/client';

@Injectable()
export class ClassFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaClass(override: Partial<Class> = {}): Promise<PrismaClass> {
    const classEntity = makeClass(override);
    return await this.prisma.class.create({
      data: {
        id: classEntity.id,
        name: classEntity.name,
        description: classEntity.description,
        timeStart: classEntity.timeStart,
        timeEnd: classEntity.timeEnd,
        dayOfWeek: classEntity.dayOfWeek,
        address: classEntity.address,
        active: classEntity.active,
        gymId: classEntity.gymId,
        userId: classEntity.userId,
        modalityId: classEntity.modalityId,
        ...override,
      },
    });
  }
}

export function makeClass(override: Partial<Class> = {}) {
  const dayOfWeekValues = Object.values(DayOfWeek);
  const startTime = faker.date.future();
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

  const classEntity = new Class({
    name: faker.lorem.words(2),
    description: faker.lorem.sentence(),
    timeStart: startTime,
    timeEnd: endTime,
    dayOfWeek: faker.helpers.arrayElement(dayOfWeekValues),
    address: faker.location.streetAddress(),
    active: faker.datatype.boolean(),
    gymId: faker.string.uuid(),
    userId: faker.string.uuid(),
    modalityId: faker.string.uuid(),
    ...override,
  });

  return classEntity;
}
