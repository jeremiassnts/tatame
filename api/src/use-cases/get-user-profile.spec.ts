import { InMemoryUsersRepository } from 'test/repositories/in-memory-users.repository';
import { GetUserProfileUseCase } from './get-user-profile';
import { makeUser } from 'test/factories/make-user';
import { makeGym } from 'test/factories/make-gym';
import { makeGraduation } from 'test/factories/make-graduation';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryGraduationsRepository } from 'test/repositories/in-memory-graduations.repository';
import { InMemoryUserRolesRepository } from 'test/repositories/in-memory-user-roles.repository';
import { InMemoryGymsRepository } from 'test/repositories/in-memory-gyms.repository';
import { InMemoryTrainingGymsRepository } from 'test/repositories/in-memory-training-gyms.repository';
import { UserNotFoundError } from './error/user-not-found.error';
import { Role, UserRole } from '../entities/user-role';
import { makeTrainingGym } from 'test/factories/make-training-gym';

let usersRepository: InMemoryUsersRepository;
let graduationsRepository: InMemoryGraduationsRepository;
let userRolesRepository: InMemoryUserRolesRepository;
let gymsRepository: InMemoryGymsRepository;
let trainingGymsRepository: InMemoryTrainingGymsRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
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
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it('should throw UserNotFoundError when user does not exist', async () => {
    await expect(
      sut.execute({
        userId: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('should return user profile for manager with gym', async () => {
    const user = makeUser();
    const gym = makeGym({ managerId: user.id });
    const graduation = makeGraduation({ userId: user.id });
    const userRole = new UserRole({ userId: user.id, role: Role.MANAGER });

    usersRepository.users.push(user);
    gymsRepository.gyms.push(gym);
    graduationsRepository.graduations.push(graduation);
    userRolesRepository.userRoles.push(userRole);

    const result = await sut.execute({
      userId: user.id,
    });

    expect(result.userProfile.user).toEqual(user);
    expect(result.userProfile.gym).toEqual(gym);
    expect(result.userProfile.graduations).toHaveLength(1);
    expect(result.userProfile.graduations[0]).toEqual(graduation);
    expect(result.userProfile.roles).toHaveLength(1);
    expect(result.userProfile.roles[0]).toEqual(userRole);
  });

  it('should return user profile for instructor with training gym', async () => {
    const user = makeUser();
    const gym = makeGym();
    const graduation = makeGraduation({ userId: user.id });
    const userRole = new UserRole({ userId: user.id, role: Role.INSTRUCTOR });
    const trainingGym = makeTrainingGym({ userId: user.id, gymId: gym.id });

    usersRepository.users.push(user);
    gymsRepository.gyms.push(gym);
    graduationsRepository.graduations.push(graduation);
    userRolesRepository.userRoles.push(userRole);
    trainingGymsRepository.trainingGyms.push(trainingGym);

    const result = await sut.execute({
      userId: user.id,
    });

    expect(result.userProfile.user).toEqual(user);
    expect(result.userProfile.gym).toEqual(gym);
    expect(result.userProfile.graduations).toHaveLength(1);
    expect(result.userProfile.graduations[0]).toEqual(graduation);
    expect(result.userProfile.roles).toHaveLength(1);
    expect(result.userProfile.roles[0]).toEqual(userRole);
  });

  it('should return user profile for student with training gym', async () => {
    const user = makeUser();
    const gym = makeGym();
    const graduation = makeGraduation({ userId: user.id });
    const userRole = new UserRole({ userId: user.id, role: Role.STUDENT });
    const trainingGym = makeTrainingGym({ userId: user.id, gymId: gym.id });

    usersRepository.users.push(user);
    gymsRepository.gyms.push(gym);
    graduationsRepository.graduations.push(graduation);
    userRolesRepository.userRoles.push(userRole);
    trainingGymsRepository.trainingGyms.push(trainingGym);

    const result = await sut.execute({
      userId: user.id,
    });

    expect(result.userProfile.user).toEqual(user);
    expect(result.userProfile.gym).toEqual(gym);
    expect(result.userProfile.graduations).toHaveLength(1);
    expect(result.userProfile.graduations[0]).toEqual(graduation);
    expect(result.userProfile.roles).toHaveLength(1);
    expect(result.userProfile.roles[0]).toEqual(userRole);
  });
});
