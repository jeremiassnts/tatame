import { describe, it, expect, beforeEach } from 'vitest';
import { CreateManagerUseCase } from './create-manager';
import { InMemoryUsersRepository } from '../../test/repositories/in-memory-users.repository';
import { InMemoryGymsRepository } from '../../test/repositories/in-memory-gyms.repository';
import { InMemoryGraduationsRepository } from '../../test/repositories/in-memory-graduations.repository';
import { InMemoryUserRolesRepository } from '../../test/repositories/in-memory-user-roles.repository';
import { FakePasswordHasher } from '../../test/services/fake-password-hasher';
import { Gender } from '../entities/user';
import { UserAlreadyExistsError } from './error/user-already-exists.error';
import { InMemoryTrainingGymsRepository } from 'test/repositories/in-memory-training-gyms.repository';

describe('Create Manager Use Case', () => {
  let sut: CreateManagerUseCase;
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
    sut = new CreateManagerUseCase(usersRepository, passwordHasher);
  });

  it('should create a new manager with gym and graduations successfully', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      gender: Gender.MALE,
      birth: new Date('1990-01-01'),
      isInstructor: true,
      gymName: "Doe's Gym",
      gymAddress: '123 Main St',
      gymLogo: 'logo.png',
      gymSince: new Date('2020-01-01'),
      graduations: [
        {
          colorId: 'color-1',
          modalityId: 'modality-1',
          extraInfo: 'Black belt',
        },
      ],
      customerId: 'customer-1',
    });

    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('john@example.com');
    expect(result.user.password).toBe('hashed_password123');
    expect(result.user.name).toBe('John Doe');

    expect(result.gym).toBeDefined();
    expect(result.gym.name).toBe("Doe's Gym");
    expect(result.gym.address).toBe('123 Main St');

    expect(result.graduations).toHaveLength(1);
    expect(result.graduations[0].colorId).toBe('color-1');
    expect(result.graduations[0].modalityId).toBe('modality-1');

    const createdUser = await usersRepository.findByEmail('john@example.com');
    expect(createdUser).toBeDefined();
    expect(createdUser?.email).toBe('john@example.com');

    expect(createdUser?.stripeCustomerId).toBe('customer-1');
  });

  it('should throw UserAlreadyExistsError when trying to create a manager with existing email', async () => {
    // First create a manager
    await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      gender: Gender.MALE,
      birth: new Date('1990-01-01'),
      isInstructor: true,
      gymName: "Doe's Gym",
      gymAddress: '123 Main St',
      gymLogo: 'logo.png',
      gymSince: new Date('2020-01-01'),
      graduations: [
        {
          colorId: 'color-1',
          modalityId: 'modality-1',
          extraInfo: 'Black belt',
        },
      ],
      customerId: 'customer-1',
    });

    // Try to create another manager with the same email
    await expect(() =>
      sut.execute({
        name: 'Another John',
        email: 'john@example.com', // Same email
        password: 'different123',
        gender: Gender.MALE,
        birth: new Date('1992-01-01'),
        isInstructor: false,
        gymName: 'Another Gym',
        gymAddress: '456 Second St',
        gymLogo: 'another-logo.png',
        gymSince: new Date('2021-01-01'),
        graduations: [
          {
            colorId: 'color-2',
            modalityId: 'modality-2',
            extraInfo: 'Brown belt',
          },
        ],
        customerId: 'customer-1',
      }),
    ).rejects.toThrow(UserAlreadyExistsError);
  });
});
