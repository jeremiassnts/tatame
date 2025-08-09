import { InMemoryUsersRepository } from 'test/repositories/in-memory-users.repository';
import { Gender, User } from 'src/domain/entities/user';
import { ChangePasswordUseCase } from './change-password';
import { FakePasswordHasher } from 'test/services/fake-password-hasher';
import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUserRolesRepository } from 'test/repositories/in-memory-user-roles.repository';
import { InMemoryGraduationsRepository } from 'test/repositories/in-memory-graduations.repository';
import { InMemoryGymsRepository } from 'test/repositories/in-memory-gyms.repository';
import { UserNotFoundError } from './error/user-not-found.error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryUserRolesRepository: InMemoryUserRolesRepository;
let inMemoryGraduationsRepository: InMemoryGraduationsRepository;
let inMemoryGymsRepository: InMemoryGymsRepository;
let passwordHasher: FakePasswordHasher;
let sut: ChangePasswordUseCase;

describe('Change password', () => {
  beforeEach(() => {
    inMemoryGraduationsRepository = new InMemoryGraduationsRepository();
    inMemoryGymsRepository = new InMemoryGymsRepository();
    inMemoryUserRolesRepository = new InMemoryUserRolesRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryGraduationsRepository,
      inMemoryGymsRepository,
      inMemoryUserRolesRepository,
    );
    passwordHasher = new FakePasswordHasher();
    sut = new ChangePasswordUseCase(inMemoryUsersRepository, passwordHasher);
  });

  it('should be able to change a user password', async () => {
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
    await sut.execute({
      userId: user.id,
      password: '000000',
    });

    expect(inMemoryUsersRepository.users[0].password).toEqual('hashed_000000');
  });
  it('should not be able to change a non valid user password', async () => {
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
        userId: '111111111111',
        password: '000000',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
    expect(inMemoryUsersRepository.users[0].password).toEqual('123456');
  });
});
