import { Injectable } from '@nestjs/common';
import { ClassesRepository } from 'src/database/repositories/classes.repository';
import { ClassCancellationsRepository } from 'src/database/repositories/class-cancellations.repository';
import { ClassNotFoundError } from './error/class-not-found.error';
import { ClassNotCancelledError } from './error/class-not-cancelled.error';

interface UncancelClassRequest {
  classId: string;
  referenceDate: Date;
}

type UncancelClassResponse = void;

@Injectable()
export class UncancelClassUseCase {
  constructor(
    private classesRepository: ClassesRepository,
    private classCancellationsRepository: ClassCancellationsRepository,
  ) {}

  async execute({
    classId,
    referenceDate,
  }: UncancelClassRequest): Promise<UncancelClassResponse> {
    // Verificar se a aula existe
    const classEntity = await this.classesRepository.findById(classId);
    if (!classEntity) {
      throw new ClassNotFoundError();
    }
    // Verificar se a aula está cancelada para esta data
    const existingCancellation =
      await this.classCancellationsRepository.findByClassIdAndDate(
        classId,
        referenceDate,
      );

    if (!existingCancellation) {
      throw new ClassNotCancelledError();
    }

    // Remover o cancelamento
    await this.classCancellationsRepository.deleteByClassIdAndDate(
      classId,
      referenceDate,
    );
  }
}
