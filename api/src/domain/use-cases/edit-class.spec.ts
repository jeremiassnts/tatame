import { EditClassUseCase } from './edit-class';
import { ModalityNotFoundError } from './error/modality-not-found.error';
import { UserNotFoundError } from './error/user-not-found.error';
import { DayOfWeek } from '../entities/class';
import { beforeEach, describe, it, expect } from 'vitest';
import { InMemoryClassesRepository } from 'test/repositories/in-memory-classes.repository';
import { InMemoryModalitiesRepository } from 'test/repositories/in-memory-modalities.repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users.repository';
import { InMemoryGraduationsRepository } from 'test/repositories/in-memory-graduations.repository';
import { InMemoryGymsRepository } from 'test/repositories/in-memory-gyms.repository';
import { InMemoryUserRolesRepository } from 'test/repositories/in-memory-user-roles.repository';
import { InMemoryTrainingGymsRepository } from 'test/repositories/in-memory-training-gyms.repository';
import { makeModality } from 'test/factories/make-modality';
import { makeUser } from 'test/factories/make-user';
import { makeClass } from 'test/factories/make-class';

let sut: EditClassUseCase;
let classesRepository: InMemoryClassesRepository;
let modalitiesRepository: InMemoryModalitiesRepository;
let graduationsRepository: InMemoryGraduationsRepository;
let gymsRepository: InMemoryGymsRepository;
let trainingGymsRepository: InMemoryTrainingGymsRepository;
let usersRepository: InMemoryUsersRepository;
let userRolesRepository: InMemoryUserRolesRepository;

describe('Edit Class', () => {
  beforeEach(() => {
    classesRepository = new InMemoryClassesRepository();
    modalitiesRepository = new InMemoryModalitiesRepository();
    graduationsRepository = new InMemoryGraduationsRepository();
    gymsRepository = new InMemoryGymsRepository();
    userRolesRepository = new InMemoryUserRolesRepository();
    trainingGymsRepository = new InMemoryTrainingGymsRepository();
    usersRepository = new InMemoryUsersRepository(
      graduationsRepository,
      gymsRepository,
      userRolesRepository,
      trainingGymsRepository,
    );
    sut = new EditClassUseCase(
      classesRepository,
      modalitiesRepository,
      usersRepository,
    );
  });

  it('should be able to edit a class', async () => {
    const modality = makeModality();
    const user = makeUser();
    const existingClass = makeClass({
      modalityId: modality.id,
      userId: user.id,
    });

    modalitiesRepository.items.push(modality);
    usersRepository.users.push(user);
    classesRepository.classes.push(existingClass);

    const newModality = makeModality();
    const newUser = makeUser();

    modalitiesRepository.items.push(newModality);
    usersRepository.users.push(newUser);

    const { class: editedClass } = await sut.execute({
      classId: existingClass.id,
      name: 'New Name',
      description: 'New Description',
      timeStart: new Date('2023-12-01T10:00:00'),
      timeEnd: new Date('2023-12-01T11:00:00'),
      dayOfWeek: DayOfWeek.MONDAY,
      userId: newUser.id,
      address: 'New Address',
      modalityId: newModality.id,
    });

    expect(editedClass.name).toBe('New Name');
    expect(editedClass.description).toBe('New Description');
    expect(editedClass.userId).toBe(newUser.id);
    expect(editedClass.modalityId).toBe(newModality.id);
    expect(editedClass.gymId).toBe(existingClass.gymId);
  });

  it('should not be able to edit a class with invalid modality', async () => {
    const user = makeUser();
    const existingClass = makeClass();

    usersRepository.users.push(user);
    classesRepository.classes.push(existingClass);

    await expect(() =>
      sut.execute({
        classId: existingClass.id,
        name: 'New Name',
        description: 'New Description',
        timeStart: new Date('2023-12-01T10:00:00'),
        timeEnd: new Date('2023-12-01T11:00:00'),
        dayOfWeek: DayOfWeek.MONDAY,
        userId: user.id,
        address: 'New Address',
        modalityId: 'invalid-modality-id',
      }),
    ).rejects.toBeInstanceOf(ModalityNotFoundError);
  });

  it('should not be able to edit a class with invalid user', async () => {
    const modality = makeModality();
    const existingClass = makeClass();

    modalitiesRepository.items.push(modality);
    classesRepository.classes.push(existingClass);

    await expect(() =>
      sut.execute({
        classId: existingClass.id,
        name: 'New Name',
        description: 'New Description',
        timeStart: new Date('2023-12-01T10:00:00'),
        timeEnd: new Date('2023-12-01T11:00:00'),
        dayOfWeek: DayOfWeek.MONDAY,
        userId: 'invalid-user-id',
        address: 'New Address',
        modalityId: modality.id,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('should not be able to edit a non-existent class', async () => {
    const modality = makeModality();
    const user = makeUser();

    modalitiesRepository.items.push(modality);
    usersRepository.users.push(user);

    await expect(() =>
      sut.execute({
        classId: 'non-existent-class-id',
        name: 'New Name',
        description: 'New Description',
        timeStart: new Date('2023-12-01T10:00:00'),
        timeEnd: new Date('2023-12-01T11:00:00'),
        dayOfWeek: DayOfWeek.MONDAY,
        userId: user.id,
        address: 'New Address',
        modalityId: modality.id,
      }),
    ).rejects.toThrow('Class not found');
  });
});
