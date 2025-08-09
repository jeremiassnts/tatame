import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryClassesRepository } from '../../../test/repositories/in-memory-classes.repository';
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users.repository';
import { InMemoryGymsRepository } from '../../../test/repositories/in-memory-gyms.repository';
import { InMemoryTrainingGymsRepository } from '../../../test/repositories/in-memory-training-gyms.repository';
import { InMemoryGraduationsRepository } from '../../../test/repositories/in-memory-graduations.repository';
import { InMemoryUserRolesRepository } from '../../../test/repositories/in-memory-user-roles.repository';
import { FetchClassesByGymUseCase } from './fetch-classes-by-gym';
import { makeClass } from '../../../test/factories/make-class';
import { makeUser } from '../../../test/factories/make-user';
import { makeGym } from '../../../test/factories/make-gym';
import { makeTrainingGym } from '../../../test/factories/make-training-gym';
import { Role, UserRole } from '../entities/user-role';
import { DayOfWeek } from '../entities/class';

describe('Fetch Classes by Gym Use Case', () => {
  let sut: FetchClassesByGymUseCase;
  let classesRepository: InMemoryClassesRepository;
  let usersRepository: InMemoryUsersRepository;
  let gymsRepository: InMemoryGymsRepository;
  let trainingGymsRepository: InMemoryTrainingGymsRepository;
  let graduationsRepository: InMemoryGraduationsRepository;
  let userRolesRepository: InMemoryUserRolesRepository;

  beforeEach(() => {
    classesRepository = new InMemoryClassesRepository();
    gymsRepository = new InMemoryGymsRepository();
    trainingGymsRepository = new InMemoryTrainingGymsRepository();
    graduationsRepository = new InMemoryGraduationsRepository();
    userRolesRepository = new InMemoryUserRolesRepository();
    usersRepository = new InMemoryUsersRepository(
      graduationsRepository,
      gymsRepository,
      userRolesRepository,
      trainingGymsRepository,
    );
    sut = new FetchClassesByGymUseCase(
      classesRepository,
      usersRepository,
      gymsRepository,
      trainingGymsRepository,
    );
  });

  it('should fetch classes for manager user', async () => {
    // Create a manager user
    const manager = makeUser();
    const gym = makeGym({ managerId: manager.id });

    usersRepository.users.push(manager);
    await gymsRepository.create(gym);
    await userRolesRepository.create(
      new UserRole({ userId: manager.id, role: Role.MANAGER }),
    );
    // Create classes for the gym
    const class1 = makeClass({
      gymId: gym.id,
      name: 'Morning Jiu-Jitsu',
      dayOfWeek: DayOfWeek.MONDAY,
    });
    const class2 = makeClass({
      gymId: gym.id,
      name: 'Evening Wrestling',
      dayOfWeek: DayOfWeek.TUESDAY,
    });
    await classesRepository.create(class1);
    await classesRepository.create(class2);
    // Create a class for another gym (should not be returned)
    const otherClass = makeClass({
      gymId: 'other-gym-id',
      name: 'Other Class',
    });
    await classesRepository.create(otherClass);

    const result = await sut.execute({ userId: manager.id });

    expect(result).toHaveLength(2);
    expect(result.some((c) => c.name === 'Morning Jiu-Jitsu')).toBe(true);
    expect(result.some((c) => c.name === 'Evening Wrestling')).toBe(true);
    expect(result.some((c) => c.name === 'Other Class')).toBe(false);
  });

  it('should fetch classes for instructor/student user through training gym', async () => {
    // Create an instructor user
    const instructor = makeUser();
    const gym = makeGym();
    const trainingGym = makeTrainingGym({
      userId: instructor.id,
      gymId: gym.id,
    });

    usersRepository.users.push(instructor);
    await gymsRepository.create(gym);
    await trainingGymsRepository.create(trainingGym);
    await userRolesRepository.create(
      new UserRole({ userId: instructor.id, role: Role.INSTRUCTOR }),
    );

    // Create classes for the gym
    const class1 = makeClass({
      gymId: gym.id,
      name: 'Beginner Class',
    });
    const class2 = makeClass({
      gymId: gym.id,
      name: 'Advanced Class',
    });

    await classesRepository.create(class1);
    await classesRepository.create(class2);

    const result = await sut.execute({ userId: instructor.id });

    expect(result).toHaveLength(2);
    expect(result.some((c) => c.name === 'Beginner Class')).toBe(true);
    expect(result.some((c) => c.name === 'Advanced Class')).toBe(true);
  });

  it('should return empty array when user has no roles', async () => {
    const user = makeUser();
    usersRepository.users.push(user);

    const result = await sut.execute({ userId: user.id });

    expect(result).toHaveLength(0);
  });

  it('should return empty array when manager has no gym', async () => {
    const manager = makeUser();
    usersRepository.users.push(manager);
    await userRolesRepository.create(
      new UserRole({ userId: manager.id, role: Role.MANAGER }),
    );

    const result = await sut.execute({ userId: manager.id });

    expect(result).toHaveLength(0);
  });

  it('should return empty array when user has no training gym', async () => {
    const student = makeUser();
    usersRepository.users.push(student);
    await userRolesRepository.create(
      new UserRole({ userId: student.id, role: Role.STUDENT }),
    );

    const result = await sut.execute({ userId: student.id });

    expect(result).toHaveLength(0);
  });
});
