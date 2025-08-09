import { InMemoryUsersRepository } from '../../test/repositories/in-memory-users.repository';
import { CreateStudentUseCase } from './create-student';
import { FakePasswordHasher } from '../../test/services/fake-password-hasher';
import { Gender } from '../entities/user';
import { UserAlreadyExistsError } from './error/user-already-exists.error';
import { InMemoryGraduationsRepository } from '../../test/repositories/in-memory-graduations.repository';
import { InMemoryGymsRepository } from '../../test/repositories/in-memory-gyms.repository';
import { InMemoryUserRolesRepository } from '../../test/repositories/in-memory-user-roles.repository';
import { InMemoryTrainingGymsRepository } from '../../test/repositories/in-memory-training-gyms.repository';
import { makeGym } from '../../test/factories/make-gym';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Create Student Use Case', () => {
  let usersRepository: InMemoryUsersRepository;
  let graduationsRepository: InMemoryGraduationsRepository;
  let gymsRepository: InMemoryGymsRepository;
  let userRolesRepository: InMemoryUserRolesRepository;
  let trainingGymsRepository: InMemoryTrainingGymsRepository;
  let sut: CreateStudentUseCase;

  beforeEach(() => {
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
    const passwordHasher = new FakePasswordHasher();
    sut = new CreateStudentUseCase(usersRepository, passwordHasher);
  });

  it('should create a student', async () => {
    const gym = makeGym();
    await gymsRepository.create(gym);

    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      gender: Gender.MALE,
      birth: new Date('1990-01-01'),
      gymId: gym.id,
      graduations: [
        {
          colorId: 'fake-color-id',
          modalityId: 'fake-modality-id',
          extraInfo: 'fake-extra-info',
        },
      ],
    });

    expect(result.user.id).toBeTruthy();
    expect(usersRepository.users[0].id).toEqual(result.user.id);
    expect(result.user.authorized).toBe(false);
    expect(result.trainingGym.gymId).toEqual(gym.id);
  });

  it('should not create a student with existing email', async () => {
    const gym = makeGym();
    await gymsRepository.create(gym);

    const email = 'john@example.com';

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
      gender: Gender.MALE,
      birth: new Date('1990-01-01'),
      gymId: gym.id,
      graduations: [
        {
          colorId: 'fake-color-id',
          modalityId: 'fake-modality-id',
          extraInfo: 'fake-extra-info',
        },
      ],
    });

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
        gender: Gender.MALE,
        birth: new Date('1990-01-01'),
        gymId: gym.id,
        graduations: [
          {
            colorId: 'fake-color-id',
            modalityId: 'fake-modality-id',
            extraInfo: 'fake-extra-info',
          },
        ],
      }),
    ).rejects.toThrow(UserAlreadyExistsError);
  });
});
