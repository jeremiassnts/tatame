import { InMemoryUsersRepository } from 'test/repositories/in-memory-users.repository';
import { FindUserByEmailUseCase } from './find-user-by-email';
import { makeUser } from 'test/factories/make-user';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGraduationsRepository } from 'test/repositories/in-memory-graduations.repository';
import { InMemoryUserRolesRepository } from 'test/repositories/in-memory-user-roles.repository';
import { InMemoryGymsRepository } from 'test/repositories/in-memory-gyms.repository';
import { InMemoryTrainingGymsRepository } from 'test/repositories/in-memory-training-gyms.repository';

let usersRepository: InMemoryUsersRepository;
let graduationsRepository: InMemoryGraduationsRepository;
let userRolesRepository: InMemoryUserRolesRepository;
let gymsRepository: InMemoryGymsRepository;
let trainingGymsRepository: InMemoryTrainingGymsRepository;
let sut: FindUserByEmailUseCase;

describe('Find User By Email Use Case', () => {
  beforeEach(() => {
    graduationsRepository = new InMemoryGraduationsRepository();
    userRolesRepository = new InMemoryUserRolesRepository();
    gymsRepository = new InMemoryGymsRepository();
    trainingGymsRepository = new InMemoryTrainingGymsRepository();
    usersRepository = new InMemoryUsersRepository(
      graduationsRepository,
      gymsRepository,
      userRolesRepository,
      trainingGymsRepository,
    );
    sut = new FindUserByEmailUseCase(usersRepository);
  });

  it('should return null when user does not exist', async () => {
    const result = await sut.execute({
      email: 'nonexistent@example.com',
    });

    expect(result.userId).toBeNull();
  });

  it('should return user id when user exists', async () => {
    const user = makeUser();
    usersRepository.users.push(user);

    const result = await sut.execute({
      email: user.email,
    });

    expect(result.userId).toBe(user.id);
  });
});
