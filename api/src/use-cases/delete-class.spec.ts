import { DeleteClassUseCase } from './delete-class';
import { beforeEach, describe, it, expect } from 'vitest';
import { InMemoryClassesRepository } from 'test/repositories/in-memory-classes.repository';
import { makeClass } from 'test/factories/make-class';
import { ClassNotFoundError } from './error/class-not-found.error';

let sut: DeleteClassUseCase;
let classesRepository: InMemoryClassesRepository;

describe('Delete Class', () => {
  beforeEach(() => {
    classesRepository = new InMemoryClassesRepository();
    sut = new DeleteClassUseCase(classesRepository);
  });

  it('should be able to delete a class', async () => {
    const existingClass = makeClass();
    classesRepository.classes.push(existingClass);

    expect(classesRepository.classes).toHaveLength(1);

    await sut.execute({
      classId: existingClass.id,
    });

    expect(classesRepository.classes).toHaveLength(0);
  });

  it('should not be able to delete a non-existent class', async () => {
    await expect(() =>
      sut.execute({
        classId: 'non-existent-class-id',
      }),
    ).rejects.toThrow(ClassNotFoundError);
  });
});
