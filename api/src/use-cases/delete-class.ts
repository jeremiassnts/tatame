import { Injectable } from '@nestjs/common';
import { ClassesRepository } from '../database/repositories/classes.repository';
import { ClassNotFoundError } from './error/class-not-found.error';

interface DeleteClassUseCaseRequest {
  classId: string;
}

@Injectable()
export class DeleteClassUseCase {
  constructor(private classesRepository: ClassesRepository) {}

  async execute({ classId }: DeleteClassUseCaseRequest): Promise<void> {
    const classToDelete = await this.classesRepository.findById(classId);

    if (!classToDelete) {
      throw new ClassNotFoundError();
    }

    await this.classesRepository.delete(classId);
  }
}
