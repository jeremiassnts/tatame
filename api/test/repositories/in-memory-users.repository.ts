import { Graduation } from 'src/domain/entities/graduation';
import { Gym } from 'src/domain/entities/gym';
import { User } from 'src/domain/entities/user';
import {
  UsersRepository,
  UserProfileData,
} from 'src/domain/repositories/users.repository';
import { InMemoryGraduationsRepository } from './in-memory-graduations.repository';
import { InMemoryGymsRepository } from './in-memory-gyms.repository';
import { InMemoryUserRolesRepository } from './in-memory-user-roles.repository';
import { Role, UserRole } from 'src/domain/entities/user-role';
import { TrainingGym } from 'src/domain/entities/training-gym';
import { InMemoryTrainingGymsRepository } from './in-memory-training-gyms.repository';

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];
  constructor(
    private graduationRepository: InMemoryGraduationsRepository,
    private gymRepository: InMemoryGymsRepository,
    private userRolesRepository: InMemoryUserRolesRepository,
    private trainingGymsRepository: InMemoryTrainingGymsRepository,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);
    if (!user) {
      return null;
    }
    return Promise.resolve(user);
  }

  async createManagerWithGymAndGraduations(
    user: User,
    gym: Gym,
    graduations: Graduation[],
    isInstructor: boolean,
  ): Promise<void> {
    this.users.push(user);
    this.gymRepository.create(gym);
    graduations.forEach((graduation) => {
      this.graduationRepository.create(graduation);
    });
    this.userRolesRepository.create(
      new UserRole({ userId: user.id, role: Role.MANAGER }),
    );
    if (isInstructor) {
      this.userRolesRepository.create(
        new UserRole({ userId: user.id, role: Role.INSTRUCTOR }),
      );
    }
    return Promise.resolve();
  }

  async createInstructorWithGraduations(
    user: User,
    graduations: Graduation[],
    trainingGym: TrainingGym,
  ): Promise<void> {
    this.users.push(user);
    graduations.forEach((graduation) => {
      this.graduationRepository.create(graduation);
    });
    this.userRolesRepository.create(
      new UserRole({ userId: user.id, role: Role.INSTRUCTOR }),
    );
    this.trainingGymsRepository.create(trainingGym);
    return Promise.resolve();
  }

  async create(
    user: User,
    graduations: Graduation[],
    role: UserRole,
  ): Promise<void> {
    this.users.push(user);
    graduations.forEach((graduation) => {
      this.graduationRepository.create(graduation);
    });
    this.userRolesRepository.create(role);
    return Promise.resolve();
  }

  async findById(userId: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === userId);
    if (!user) {
      return null;
    }
    return Promise.resolve(user);
  }

  async findByIdWithRelations(userId: string): Promise<UserProfileData | null> {
    const user = this.users.find((user) => user.id === userId);
    if (!user) {
      return null;
    }

    const graduations = this.graduationRepository.graduations.filter(
      (graduation) => graduation.userId === userId,
    );

    const roles = this.userRolesRepository.userRoles.filter(
      (role) => role.userId === userId,
    );

    // Check if user is a manager (has a gym)
    let gym = this.gymRepository.gyms.find((gym) => gym.managerId === userId);

    // If not a manager, check if user has training gym relation
    if (!gym) {
      const trainingGym = this.trainingGymsRepository.trainingGyms.find(
        (tg) => tg.userId === userId,
      );
      if (trainingGym) {
        gym = this.gymRepository.gyms.find(
          (gym) => gym.id === trainingGym.gymId,
        );
      }
    }

    return Promise.resolve({
      user,
      gym: gym || null,
      graduations,
      roles,
    });
  }

  async changePassword(userId: string, password: string): Promise<void> {
    const user = this.users.find((user) => user.id === userId);
    if (!user) {
      return;
    }
    user.password = password;
    return Promise.resolve();
  }

  async update(user: User): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === user.id);
    if (userIndex >= 0) {
      this.users[userIndex] = user;
    }
    return Promise.resolve();
  }

  async createStudentWithGraduations(
    user: User,
    graduations: Graduation[],
    trainingGym: TrainingGym,
  ): Promise<void> {
    this.users.push(user);
    graduations.forEach((graduation) => {
      this.graduationRepository.create(graduation);
    });
    this.trainingGymsRepository.create(trainingGym);
    return Promise.resolve();
  }

  async findUserRolesByUserId(userId: string): Promise<UserRole[]> {
    return Promise.resolve(
      this.userRolesRepository.userRoles.filter(
        (role) => role.userId === userId,
      ),
    );
  }
  async findManyInstructorsByGymId(gymId: string): Promise<User[]> {
    const instructors = this.users.filter((user) => {
      if (
        !this.trainingGymsRepository.trainingGyms.some(
          (tg) => tg.userId === user.id && tg.gymId === gymId,
        ) &&
        !this.gymRepository.gyms.some(
          (g) => g.managerId === user.id && g.id === gymId,
        )
      )
        return false;
      const hasInstructorRole = this.userRolesRepository.userRoles.some(
        (role) => role.userId === user.id && role.role === Role.INSTRUCTOR,
      );
      return hasInstructorRole;
    });
    return Promise.resolve(instructors);
  }
}
