import {
  Class as PrismaClass,
  Gym as PrismaGym,
  User as PrismaUser,
  Modality as PrismaModality,
  Prisma,
  DayOfWeek as PrismaDayOfWeek,
  ClassCancellation as PrismaClassCancellation,
} from '@prisma/client';
import { Class, DayOfWeek } from '../../../entities/class';
import { ClassWithDetails } from 'src/entities/class-with-details';

export class PrismaClassMapper {
  static toDomain(raw: PrismaClass): Class {
    return new Class({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      timeStart: raw.timeStart,
      timeEnd: raw.timeEnd,
      dayOfWeek: raw.dayOfWeek as DayOfWeek,
      address: raw.address,
      active: raw.active,
      gymId: raw.gymId,
      userId: raw.userId,
      modalityId: raw.modalityId,
    });
  }

  static toDomainWithDetails(
    raw: PrismaClass & {
      gym: PrismaGym;
      instructor: PrismaUser;
      modality: PrismaModality;
      ClassCancellation: PrismaClassCancellation[];
    },
  ): ClassWithDetails {
    return new ClassWithDetails({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      timeStart: raw.timeStart,
      timeEnd: raw.timeEnd,
      dayOfWeek: raw.dayOfWeek as DayOfWeek,
      address: raw.address,
      active: raw.active,
      gymId: raw.gymId,
      userId: raw.userId,
      modalityId: raw.modalityId,
      gymName: raw.gym.name,
      instructorName: raw.instructor.name,
      modalityName: raw.modality.name,
      cancellations: raw.ClassCancellation.map((c) => c.referenceDate),
    });
  }

  static toPrisma(classEntity: Class): Prisma.ClassUncheckedCreateInput {
    return {
      id: classEntity.id,
      name: classEntity.name,
      description: classEntity.description,
      timeStart: classEntity.timeStart,
      timeEnd: classEntity.timeEnd,
      dayOfWeek: classEntity.dayOfWeek as PrismaDayOfWeek,
      address: classEntity.address,
      active: classEntity.active,
      gymId: classEntity.gymId,
      userId: classEntity.userId,
      modalityId: classEntity.modalityId,
    };
  }
}
