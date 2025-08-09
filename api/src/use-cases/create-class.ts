import { Injectable } from '@nestjs/common';
import { Class, DayOfWeek } from '../entities/class';
import { ClassesRepository } from '../database/repositories/classes.repository';

interface CreateClassUseCaseRequest {
  name: string;
  description: string;
  timeStart: Date;
  timeEnd: Date;
  daysOfWeek: DayOfWeek[];
  address: string;
  gymId: string;
  userId: string;
  modalityId: string;
}

@Injectable()
export class CreateClassUseCase {
  constructor(private classesRepository: ClassesRepository) {}

  async execute(props: CreateClassUseCaseRequest) {
    const {
      name,
      description,
      timeStart,
      timeEnd,
      daysOfWeek,
      address,
      gymId,
      userId,
      modalityId,
    } = props;

    const newClasses = daysOfWeek.map((dayOfWeek) => {
      return new Class({
        name,
        description,
        timeStart,
        timeEnd,
        dayOfWeek,
        address,
        gymId,
        userId,
        modalityId,
        active: true,
      });
    });

    const promises = newClasses.map((newClass) => {
      return this.classesRepository.create(newClass);
    });

    await Promise.all(promises);

    return {
      classes: newClasses,
    };
  }
}
