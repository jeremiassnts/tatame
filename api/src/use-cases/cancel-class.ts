import { Injectable } from '@nestjs/common';
import { ClassesRepository } from 'src/database/repositories/classes.repository';
import { ClassCancellationsRepository } from 'src/database/repositories/class-cancellations.repository';
import { ClassCancellation } from 'src/entities/class-cancellation';
import { ClassNotFoundError } from './error/class-not-found.error';
import { ClassAlreadyCancelledError } from './error/class-already-cancelled.error';

interface CancelClassRequest {
  classId: string;
  referenceDate: Date;
}

type CancelClassResponse = void;

@Injectable()
export class CancelClassUseCase {
  constructor(
    private classesRepository: ClassesRepository,
    private classCancellationsRepository: ClassCancellationsRepository,
  ) {}

  async execute({
    classId,
    referenceDate,
  }: CancelClassRequest): Promise<CancelClassResponse> {
    // Verificar se a aula existe
    const classEntity = await this.classesRepository.findById(classId);

    if (!classEntity) {
      throw new ClassNotFoundError();
    }

    // Verificar se a aula já foi cancelada para esta data
    const existingCancellation =
      await this.classCancellationsRepository.findByClassIdAndDate(
        classId,
        referenceDate,
      );

    if (existingCancellation) {
      throw new ClassAlreadyCancelledError();
    }

    // Criar o cancelamento
    const classCancellation = new ClassCancellation({
      classId,
      referenceDate,
      createdAt: new Date(),
    });

    await this.classCancellationsRepository.create(classCancellation);
  }
}
