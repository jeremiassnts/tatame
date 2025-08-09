/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user';
import {
  UsersRepository,
  UserProfileData,
} from '../../../domain/repositories/users.repository';
import { PrismaService } from './prisma.service';
import { PrismaUserMapper } from '../../mappers/prisma/prisma-user.mapper';
import { Gym } from '../../../domain/entities/gym';
import { Graduation } from '../../../domain/entities/graduation';
import { Role, UserRole } from '../../../domain/entities/user-role';
import { PrismaGymMapper } from '../../mappers/prisma/prisma-gym.mapper';
import { PrismaGraduationMapper } from '../../mappers/prisma/prisma-graduation.mapper';
import { PrismaUserRoleMapper } from '../../mappers/prisma/prisma-user-role.mapper';
import { TrainingGym } from '../../../domain/entities/training-gym';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async createManagerWithGymAndGraduations(
    user: User,
    gym: Gym,
    graduations: Graduation[],
    isInstructor: boolean,
  ): Promise<void> {
    const userData = PrismaUserMapper.toPrisma(user);
    //removing managerId from gym data to nested creation
    const { managerId, ...gymData } = PrismaGymMapper.toPrisma(gym);
    //removing userId from graduations to nested creation
    const graduationsData = graduations.map((g) => {
      const { userId, ...graduationData } = PrismaGraduationMapper.toPrisma(g);
      return graduationData;
    });
    //removing userId from roles to nested creation
    const { userId, ...managerRole } = PrismaUserRoleMapper.toPrisma(
      new UserRole({ role: Role.MANAGER }),
    );
    const userRolesData = [managerRole];
    if (isInstructor) {
      const { userId, ...instructorRole } = PrismaUserRoleMapper.toPrisma(
        new UserRole({ role: Role.INSTRUCTOR }),
      );
      userRolesData.push(instructorRole);
    }

    await this.prisma.user.create({
      data: {
        ...userData,
        userRoles: {
          createMany: {
            data: userRolesData,
          },
        },
        gym: {
          create: {
            ...gymData,
          },
        },
        graduations: {
          createMany: {
            data: graduationsData,
          },
        },
      },
    });
  }

  async createInstructorWithGraduations(
    user: User,
    graduations: Graduation[],
    trainingGym: TrainingGym,
  ): Promise<void> {
    const userData = PrismaUserMapper.toPrisma(user);
    const graduationsData = graduations.map((g) => {
      const { userId, ...graduationData } = PrismaGraduationMapper.toPrisma(g);
      return graduationData;
    });
    const { userId, ...instructorRole } = PrismaUserRoleMapper.toPrisma(
      new UserRole({ role: Role.INSTRUCTOR }),
    );

    await this.prisma.user.create({
      data: {
        ...userData,
        userRoles: {
          create: instructorRole,
        },
        graduations: {
          createMany: {
            data: graduationsData,
          },
        },
        TrainingGym: {
          create: {
            id: trainingGym.id,
            gymId: trainingGym.gymId,
            createdAt: trainingGym.createdAt,
          },
        },
      },
    });
  }

  async createStudentWithGraduations(
    user: User,
    graduations: Graduation[],
    trainingGym: TrainingGym,
  ): Promise<void> {
    const userData = PrismaUserMapper.toPrisma(user);
    const graduationsData = graduations.map((g) => {
      const { userId, ...graduationData } = PrismaGraduationMapper.toPrisma(g);
      return graduationData;
    });
    const { userId, ...studentRole } = PrismaUserRoleMapper.toPrisma(
      new UserRole({ role: Role.STUDENT }),
    );

    await this.prisma.user.create({
      data: {
        ...userData,
        userRoles: {
          create: studentRole,
        },
        graduations: {
          createMany: {
            data: graduationsData,
          },
        },
        TrainingGym: {
          create: {
            id: trainingGym.id,
            gymId: trainingGym.gymId,
            createdAt: trainingGym.createdAt,
          },
        },
      },
    });
  }

  async create(
    user: User,
    graduations: Graduation[],
    role: UserRole,
  ): Promise<void> {
    const userData = PrismaUserMapper.toPrisma(user);
    const graduationsData = graduations.map((g) => {
      const { userId, ...graduationData } = PrismaGraduationMapper.toPrisma(g);
      return graduationData;
    });
    const { userId, ...roleData } = PrismaUserRoleMapper.toPrisma(
      new UserRole({
        role: role.role,
      }),
    );

    await this.prisma.user.create({
      data: {
        ...userData,
        userRoles: {
          create: roleData,
        },
        graduations: {
          createMany: {
            data: graduationsData,
          },
        },
      },
    });
  }

  async findById(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findByIdWithRelations(userId: string): Promise<UserProfileData | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: true,
        graduations: {
          include: {
            color: {
              include: {
                modality: true,
              },
            },
          },
        },
        gym: true,
        TrainingGym: {
          include: {
            gym: true,
          },
        },
      },
    });

    if (!userData) return null;

    const user = PrismaUserMapper.toDomain(userData);

    const roles = userData.userRoles.map((role) =>
      PrismaUserRoleMapper.toDomain(role),
    );

    const graduations = userData.graduations.map((graduation) =>
      PrismaGraduationMapper.toDomain(graduation),
    );

    // Determine gym: either owned gym (for managers) or training gym
    let gym: Gym | null = null;
    if (userData.gym) {
      gym = PrismaGymMapper.toDomain(userData.gym);
    } else if (userData.TrainingGym.length > 0) {
      // Get the first active training gym
      const activeTrainingGym = userData.TrainingGym.find(
        (tg) => !tg.deletedAt,
      );
      if (activeTrainingGym && activeTrainingGym.gym) {
        gym = PrismaGymMapper.toDomain(activeTrainingGym.gym);
      }
    }

    return {
      user,
      gym,
      graduations,
      roles,
    };
  }

  async changePassword(userId: string, password: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password },
    });
  }

  async update(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);
    await this.prisma.user.update({
      where: { id: user.id },
      data,
    });
  }

  async findUserRolesByUserId(userId: string): Promise<UserRole[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
    });

    return userRoles.map((role) => PrismaUserRoleMapper.toDomain(role));
  }

  async findManyInstructorsByGymId(gymId: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            TrainingGym: {
              some: {
                gymId,
              },
            },
          },
          {
            gym: {
              id: gymId,
            },
          },
        ],
        userRoles: {
          some: {
            role: Role.INSTRUCTOR,
          },
        },
      },
    });

    return users.map((user) => PrismaUserMapper.toDomain(user));
  }
}
