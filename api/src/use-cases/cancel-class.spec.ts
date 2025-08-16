import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryClassesRepository } from '../../test/repositories/in-memory-classes.repository';
import { InMemoryClassCancellationsRepository } from '../../test/repositories/in-memory-class-cancellations.repository';
import { CancelClassUseCase } from './cancel-class';
import { makeClass } from '../../test/factories/make-class';
import { ClassNotFoundError } from './error/class-not-found.error';
import { ClassAlreadyCancelledError } from './error/class-already-cancelled.error';
import { ClassCancellation } from '../entities/class-cancellation';

describe('Cancel Class Use Case', () => {
  let sut: CancelClassUseCase;
  let classesRepository: InMemoryClassesRepository;
  let classCancellationsRepository: InMemoryClassCancellationsRepository;

  beforeEach(() => {
    classesRepository = new InMemoryClassesRepository();
    classCancellationsRepository = new InMemoryClassCancellationsRepository();
    sut = new CancelClassUseCase(
      classesRepository,
      classCancellationsRepository,
    );
  });

  it('should cancel a class', async () => {
    const classEntity = makeClass();
    await classesRepository.create(classEntity);

    const referenceDate = new Date('2024-01-15T08:00:00Z');

    await sut.execute({
      classId: classEntity.id,
      referenceDate,
    });

    expect(classCancellationsRepository.classCancellations).toHaveLength(1);
    expect(classCancellationsRepository.classCancellations[0]).toEqual(
      expect.objectContaining({
        classId: classEntity.id,
        referenceDate,
        createdAt: expect.any(Date),
      }),
    );
  });

  it('should not cancel a class that does not exist', async () => {
    const referenceDate = new Date('2024-01-15T08:00:00Z');

    await expect(
      sut.execute({
        classId: 'non-existent-class-id',
        referenceDate,
      }),
    ).rejects.toBeInstanceOf(ClassNotFoundError);
  });

  it('should not cancel a class that is already cancelled for the same date', async () => {
    const classEntity = makeClass();
    await classesRepository.create(classEntity);

    const referenceDate = new Date('2024-01-15T08:00:00Z');

    // Criar um cancelamento já existente
    const existingCancellation = new ClassCancellation({
      classId: classEntity.id,
      referenceDate,
      createdAt: new Date(),
    });
    await classCancellationsRepository.create(existingCancellation);

    await expect(
      sut.execute({
        classId: classEntity.id,
        referenceDate,
      }),
    ).rejects.toBeInstanceOf(ClassAlreadyCancelledError);
  });

  it('should be able to cancel the same class for different dates', async () => {
    const classEntity = makeClass();
    await classesRepository.create(classEntity);

    const firstDate = new Date('2024-01-15T08:00:00Z');
    const secondDate = new Date('2024-01-16T08:00:00Z');

    await sut.execute({
      classId: classEntity.id,
      referenceDate: firstDate,
    });

    await sut.execute({
      classId: classEntity.id,
      referenceDate: secondDate,
    });

    expect(classCancellationsRepository.classCancellations).toHaveLength(2);
    expect(
      classCancellationsRepository.classCancellations[0].referenceDate,
    ).toEqual(firstDate);
    expect(
      classCancellationsRepository.classCancellations[1].referenceDate,
    ).toEqual(secondDate);
  });
});
