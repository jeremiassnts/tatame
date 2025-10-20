import { User } from 'src/entities/user';
import { Gym } from '../../entities/gym';
import { Graduation } from '../../entities/graduation';
import { UserRole } from '../../entities/user-role';
import { TrainingGym } from '../../entities/training-gym';

export interface UserProfileData {
  user: User;
  gym: Gym | null;
  graduations: Graduation[];
  roles: UserRole[];
}
export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract createManagerWithGymAndGraduations(
    user: User,
    gym: Gym,
    graduations: Graduation[],
  ): Promise<void>;
  abstract createInstructorWithGraduations(
    user: User,
    graduations: Graduation[],
    trainingGym: TrainingGym,
  ): Promise<void>;
  abstract createStudentWithGraduations(
    user: User,
    graduations: Graduation[],
    trainingGym: TrainingGym,
  ): Promise<void>;
  abstract create(
    user: User,
    graduations: Graduation[],
    role: UserRole,
  ): Promise<void>;
  abstract findById(userId: string): Promise<User | null>;
  abstract findByIdWithRelations(
    userId: string,
  ): Promise<UserProfileData | null>;
  abstract findUserRolesByUserId(userId: string): Promise<UserRole[]>;
  abstract changePassword(userId: string, password: string): Promise<void>;
  abstract update(user: User): Promise<void>;
  abstract findManyInstructorsByGymId(gymId: string): Promise<User[]>;
}
