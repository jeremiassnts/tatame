import { Injectable } from '@nestjs/common';
import { Class, DayOfWeek } from '../entities/class';
import { ClassesRepository } from '../database/repositories/classes.repository';
import { ModalitiesRepository } from '../database/repositories/modalities.repository';
import { UsersRepository } from '../database/repositories/users.repository';
import { ModalityNotFoundError } from './error/modality-not-found.error';
import { UserNotFoundError } from './error/user-not-found.error';

interface EditClassUseCaseRequest {
  classId: string;
  name: string;
  description: string;
  timeStart: Date;
  timeEnd: Date;
  dayOfWeek: DayOfWeek;
  userId: string;
  address: string;
  modalityId: string;
}

interface EditClassUseCaseResponse {
  class: Class;
}

@Injectable()
export class EditClassUseCase {
  constructor(
    private classesRepository: ClassesRepository,
    private modalitiesRepository: ModalitiesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    classId,
    name,
    description,
    timeStart,
    timeEnd,
    dayOfWeek,
    userId,
    address,
    modalityId,
  }: EditClassUseCaseRequest): Promise<EditClassUseCaseResponse> {
    const classToEdit = await this.classesRepository.findById(classId);

    if (!classToEdit) {
      throw new Error('Class not found');
    }

    const modality = await this.modalitiesRepository.findById(modalityId);

    if (!modality) {
      throw new ModalityNotFoundError();
    }

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const updatedClass = new Class({
      name,
      description,
      timeStart,
      timeEnd,
      dayOfWeek,
      userId,
      address,
      modalityId,
      gymId: classToEdit.gymId,
      active: classToEdit.active,
      id: classId,
    });

    await this.classesRepository.save(updatedClass);

    return {
      class: updatedClass,
    };
  }
}
