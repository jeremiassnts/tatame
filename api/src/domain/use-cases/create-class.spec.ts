import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryClassesRepository } from '../../../test/repositories/in-memory-classes.repository';
import { CreateClassUseCase } from './create-class';
import { DayOfWeek } from '../entities/class';

describe('Create Class Use Case', () => {
  let sut: CreateClassUseCase;
  let classesRepository: InMemoryClassesRepository;

  beforeEach(() => {
    classesRepository = new InMemoryClassesRepository();
    sut = new CreateClassUseCase(classesRepository);
  });

  it('should create a class', async () => {
    const result = await sut.execute({
      name: 'Morning Jiu-Jitsu',
      description: 'Beginner friendly class',
      timeStart: new Date('2024-01-15T08:00:00Z'),
      timeEnd: new Date('2024-01-15T09:30:00Z'),
      daysOfWeek: [DayOfWeek.MONDAY],
      address: '123 Main St',
      gymId: 'gym-1',
      userId: 'instructor-1',
      modalityId: 'modality-1',
    });

    expect(result.classes[0].id).toEqual(expect.any(String));
    expect(classesRepository.classes).toHaveLength(1);
  });
});
