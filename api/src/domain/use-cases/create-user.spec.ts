import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users.repository';
import { InMemoryGymsRepository } from '../../../test/repositories/in-memory-gyms.repository';
import { InMemoryGraduationsRepository } from '../../../test/repositories/in-memory-graduations.repository';
import { InMemoryUserRolesRepository } from '../../../test/repositories/in-memory-user-roles.repository';
import { FakePasswordHasher } from '../../../test/services/fake-password-hasher';
import { Gender } from '../entities/user';
import { UserAlreadyExistsError } from './error/user-already-exists.error';
import { CreateUserUseCase } from './create-user';
import { Role } from '../entities/user-role';
import { InMemoryTrainingGymsRepository } from 'test/repositories/in-memory-training-gyms.repository';

describe('Create Manager Use Case', () => {
  let sut: CreateUserUseCase;
  let usersRepository: InMemoryUsersRepository;
  let gymsRepository: InMemoryGymsRepository;
  let graduationsRepository: InMemoryGraduationsRepository;
  let userRolesRepository: InMemoryUserRolesRepository;
  let trainingGymsRepository: InMemoryTrainingGymsRepository;
  let passwordHasher: FakePasswordHasher;

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    graduationsRepository = new InMemoryGraduationsRepository();
    userRolesRepository = new InMemoryUserRolesRepository();
    trainingGymsRepository = new InMemoryTrainingGymsRepository();
    usersRepository = new InMemoryUsersRepository(
      graduationsRepository,
      gymsRepository,
      userRolesRepository,
      trainingGymsRepository,
    );
    passwordHasher = new FakePasswordHasher();
    sut = new CreateUserUseCase(usersRepository, passwordHasher);
  });

  it('should create a new user with graduations successfully', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      gender: Gender.MALE,
      birth: new Date('1990-01-01'),
      graduations: [
        {
          colorId: 'color-1',
          modalityId: 'modality-1',
          extraInfo: 'Black belt',
        },
      ],
      role: Role.MANAGER,
    });

    const createdUser = usersRepository.users[0];
    const createdRole = userRolesRepository.userRoles[0];
    const createdGraduation = graduationsRepository.graduations[0];

    expect(createdUser?.email).toBe('john@example.com');

    expect(createdRole.role).toBe(Role.MANAGER);

    expect(createdGraduation.colorId).toBe('color-1');
    expect(createdGraduation.modalityId).toBe('modality-1');
  });

  it('should throw UserAlreadyExistsError when trying to create a manager with existing email', async () => {
    // First create a manager
    await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      gender: Gender.MALE,
      birth: new Date('1990-01-01'),
      graduations: [
        {
          colorId: 'color-1',
          modalityId: 'modality-1',
          extraInfo: 'Black belt',
        },
      ],
      role: Role.MANAGER,
    });

    // Try to create another manager with the same email
    await expect(() =>
      sut.execute({
        name: 'Another John',
        email: 'john@example.com', // Same email
        password: 'different123',
        gender: Gender.MALE,
        birth: new Date('1992-01-01'),
        role: Role.MANAGER,
        graduations: [
          {
            colorId: 'color-2',
            modalityId: 'modality-2',
            extraInfo: 'Brown belt',
          },
        ],
      }),
    ).rejects.toThrow(UserAlreadyExistsError);
  });
});
