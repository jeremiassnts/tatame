import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryClassesRepository } from '../../test/repositories/in-memory-classes.repository';
import { InMemoryClassCancellationsRepository } from '../../test/repositories/in-memory-class-cancellations.repository';
import { UncancelClassUseCase } from './uncancel-class';
import { makeClass } from '../../test/factories/make-class';
import { ClassNotFoundError } from './error/class-not-found.error';
import { ClassNotCancelledError } from './error/class-not-cancelled.error';
import { ClassCancellation } from '../entities/class-cancellation';

describe('Uncancel Class Use Case', () => {
  let sut: UncancelClassUseCase;
  let classesRepository: InMemoryClassesRepository;
  let classCancellationsRepository: InMemoryClassCancellationsRepository;

  beforeEach(() => {
    classesRepository = new InMemoryClassesRepository();
    classCancellationsRepository = new InMemoryClassCancellationsRepository();
    sut = new UncancelClassUseCase(
      classesRepository,
      classCancellationsRepository,
    );
  });

  it('should uncancel a class', async () => {
    const classEntity = makeClass();
    classesRepository.classes.push(classEntity);

    const referenceDate = new Date('2024-01-15T08:00:00Z');

    // Criar um cancelamento primeiro
    const classCancellation = new ClassCancellation({
      classId: classEntity.id,
      referenceDate,
      createdAt: new Date(),
    });
    classCancellationsRepository.classCancellations.push(classCancellation);

    // Desfazer o cancelamento
    await sut.execute({
      classId: classEntity.id,
      referenceDate,
    });

    expect(classCancellationsRepository.classCancellations).toHaveLength(0);
  });

  it('should not uncancel a class that does not exist', async () => {
    const referenceDate = new Date('2024-01-15T08:00:00Z');

    await expect(
      sut.execute({
        classId: 'non-existent-class-id',
        referenceDate,
      }),
    ).rejects.toBeInstanceOf(ClassNotFoundError);
  });

  it('should not uncancel a class that is not cancelled for the specified date', async () => {
    const classEntity = makeClass();
    await classesRepository.create(classEntity);

    const referenceDate = new Date('2024-01-15T08:00:00Z');

    await expect(
      sut.execute({
        classId: classEntity.id,
        referenceDate,
      }),
    ).rejects.toBeInstanceOf(ClassNotCancelledError);
  });

  it('should be able to uncancel only specific dates', async () => {
    const classEntity = makeClass();
    await classesRepository.create(classEntity);

    const firstDate = new Date('2024-01-15T08:00:00Z');
    const secondDate = new Date('2024-01-16T08:00:00Z');

    // Criar dois cancelamentos para datas diferentes
    const firstCancellation = new ClassCancellation({
      classId: classEntity.id,
      referenceDate: firstDate,
      createdAt: new Date(),
    });
    const secondCancellation = new ClassCancellation({
      classId: classEntity.id,
      referenceDate: secondDate,
      createdAt: new Date(),
    });

    await classCancellationsRepository.create(firstCancellation);
    await classCancellationsRepository.create(secondCancellation);

    expect(classCancellationsRepository.classCancellations).toHaveLength(2);

    // Desfazer apenas o primeiro cancelamento
    await sut.execute({
      classId: classEntity.id,
      referenceDate: firstDate,
    });

    expect(classCancellationsRepository.classCancellations).toHaveLength(1);
    expect(
      classCancellationsRepository.classCancellations[0].referenceDate,
    ).toEqual(secondDate);
  });
});
