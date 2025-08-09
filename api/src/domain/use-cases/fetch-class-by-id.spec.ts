import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryClassesRepository } from '../../../test/repositories/in-memory-classes.repository';
import { makeClass } from '../../../test/factories/make-class';
import { DayOfWeek } from '../entities/class';
import { FetchClassByIdUseCase } from './fetch-class-by-id';
import { ClassNotFoundError } from './error/class-not-found.error';

describe('Fetch Class by id', () => {
  let sut: FetchClassByIdUseCase;
  let classesRepository: InMemoryClassesRepository;

  beforeEach(() => {
    classesRepository = new InMemoryClassesRepository();
    sut = new FetchClassByIdUseCase(classesRepository);
  });

  it('should fetch classes for manager user', async () => {
    // Create classes for the gym
    const class1 = makeClass({
      gymId: 'gym.id',
      name: 'Morning Jiu-Jitsu',
      dayOfWeek: DayOfWeek.MONDAY,
    });
    await classesRepository.create(class1);

    const result = await sut.execute({ classId: class1.id });
    expect(result?.id).toEqual(class1.id);
  });

  it('should throw error if class not found', async () => {
    await expect(() =>
      sut.execute({ classId: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(ClassNotFoundError);
  });
});
