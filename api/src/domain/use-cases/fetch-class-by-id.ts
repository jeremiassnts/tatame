import { Injectable } from '@nestjs/common';
import { ClassesRepository } from '../repositories/classes.repository';
import { ClassWithDetails } from '../entities/class-with-details';
import { ClassNotFoundError } from './error/class-not-found.error';

interface FetchClassByIdUseCaseRequest {
  classId: string;
}

@Injectable()
export class FetchClassByIdUseCase {
  constructor(private classesRepository: ClassesRepository) {}

  async execute(
    props: FetchClassByIdUseCaseRequest,
  ): Promise<ClassWithDetails> {
    const { classId } = props;
    const data = await this.classesRepository.findByIdWithDetails(classId);
    if (!data) {
      throw new ClassNotFoundError();
    }

    return data;
  }
}
