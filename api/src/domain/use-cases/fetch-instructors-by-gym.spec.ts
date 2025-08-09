import { InMemoryUsersRepository } from 'test/repositories/in-memory-users.repository';
import { makeUser } from 'test/factories/make-user';
import { FetchInstructorsByGymUseCase } from './fetch-instructors-by-gym';
import { describe, beforeEach, it, expect } from 'vitest';
import { InMemoryGraduationsRepository } from 'test/repositories/in-memory-graduations.repository';
import { InMemoryGymsRepository } from 'test/repositories/in-memory-gyms.repository';
import { InMemoryUserRolesRepository } from 'test/repositories/in-memory-user-roles.repository';
import { InMemoryTrainingGymsRepository } from 'test/repositories/in-memory-training-gyms.repository';
import { Role, UserRole } from '../entities/user-role';
import { TrainingGym } from '../entities/training-gym';
import { makeGym } from 'test/factories/make-gym';

describe('Fetch Instructors By Gym', () => {
  let sut: FetchInstructorsByGymUseCase;
  let usersRepository: InMemoryUsersRepository;
  let gymsRepository: InMemoryGymsRepository;
  let graduationRepository: InMemoryGraduationsRepository;
  let userRolesRepository: InMemoryUserRolesRepository;
  let trainingGymsRepository: InMemoryTrainingGymsRepository;

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    graduationRepository = new InMemoryGraduationsRepository();
    userRolesRepository = new InMemoryUserRolesRepository();
    trainingGymsRepository = new InMemoryTrainingGymsRepository();
    usersRepository = new InMemoryUsersRepository(
      graduationRepository,
      gymsRepository,
      userRolesRepository,
      trainingGymsRepository,
    );

    sut = new FetchInstructorsByGymUseCase(usersRepository);
  });

  it('should be able to fetch instructors by gym', async () => {
    const instructor1 = makeUser();
    const instructor2 = makeUser();

    const role1 = new UserRole({
      userId: instructor1.id,
      role: Role.INSTRUCTOR,
    });
    const role2 = new UserRole({
      userId: instructor2.id,
      role: Role.INSTRUCTOR,
    });

    const gym1 = makeGym();
    const gym2 = makeGym();

    const trainingGym1 = new TrainingGym({
      gymId: gym1.id,
      createdAt: new Date(),
      userId: instructor1.id,
    });

    const trainingGym2 = new TrainingGym({
      gymId: gym2.id,
      createdAt: new Date(),
      userId: instructor2.id,
    });

    usersRepository.users.push(instructor1, instructor2);
    userRolesRepository.userRoles.push(role1, role2);
    trainingGymsRepository.trainingGyms.push(trainingGym1, trainingGym2);
    gymsRepository.gyms.push(gym1, gym2);

    const { instructors } = await sut.execute({
      gymId: gym1.id,
    });

    expect(instructors).toHaveLength(1);
    expect(instructors).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: instructor1.id })]),
    );
  });
});
