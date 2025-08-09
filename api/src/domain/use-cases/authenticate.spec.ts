import { InMemoryUsersRepository } from 'test/repositories/in-memory-users.repository';
import { AuthenticateUseCase } from './authenticate';
import { describe, it, expect, beforeEach } from 'vitest';
import { FakeEncrypter } from 'test/services/fake-encrypter';
import { FakePasswordHasher } from 'test/services/fake-password-hasher';
import { InMemoryUserRolesRepository } from 'test/repositories/in-memory-user-roles.repository';
import { InMemoryGraduationsRepository } from 'test/repositories/in-memory-graduations.repository';
import { InMemoryGymsRepository } from 'test/repositories/in-memory-gyms.repository';
import { Gender, User } from '../entities/user';
import { WrongCredentialsError } from './error/wrong-credentials.error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryUserRolesRepository: InMemoryUserRolesRepository;
let inMemoryGraduationsRepository: InMemoryGraduationsRepository;
let inMemoryGymsRepository: InMemoryGymsRepository;
let fakeHasher: FakePasswordHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateUseCase;

describe('Authenticate user', () => {
  beforeEach(() => {
    fakeHasher = new FakePasswordHasher();
    fakeEncrypter = new FakeEncrypter();
    inMemoryGraduationsRepository = new InMemoryGraduationsRepository();
    inMemoryGymsRepository = new InMemoryGymsRepository();
    inMemoryUserRolesRepository = new InMemoryUserRolesRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryGraduationsRepository,
      inMemoryGymsRepository,
      inMemoryUserRolesRepository,
    );
    fakeHasher = new FakePasswordHasher();
    sut = new AuthenticateUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate a valid user', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed_123456',
      authorized: false,
      birth: new Date('1990-01-01'),
      gender: Gender.MALE,
      tier: 'free',
      createdAt: new Date(),
      authToken: 'authToken',
      profilePhotoUrl: 'profilePhotoUrl',
    });
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      email: 'john@example.com',
      password: '123456',
    });

    expect(result.accessToken).toEqual(expect.any(String));
  });

  it('should not be able to authenticate a non valid email user', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      authorized: false,
      birth: new Date('1990-01-01'),
      gender: Gender.MALE,
      tier: 'free',
      createdAt: new Date(),
      authToken: 'authToken',
      profilePhotoUrl: 'profilePhotoUrl',
    });
    inMemoryUsersRepository.users.push(user);

    await expect(() =>
      sut.execute({
        email: 'test@nonvalid.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });

  it('should not be able to authenticate a non valid password user', async () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      authorized: false,
      birth: new Date('1990-01-01'),
      gender: Gender.MALE,
      tier: 'free',
      createdAt: new Date(),
      authToken: 'authToken',
      profilePhotoUrl: 'profilePhotoUrl',
    });
    inMemoryUsersRepository.users.push(user);

    await expect(() =>
      sut.execute({
        email: 'test@example.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(WrongCredentialsError);
  });
});
