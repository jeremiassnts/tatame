import { Injectable } from '@nestjs/common';
import { ClassesRepository } from '../database/repositories/classes.repository';
import { UsersRepository } from '../database/repositories/users.repository';
import { GymsRepository } from '../database/repositories/gyms.repository';
import { TrainingGymsRepository } from '../database/repositories/training-gyms.repository';
import { Role } from '../entities/user-role';
import { ClassWithDetails } from '../entities/class-with-details';

interface FetchClassesByGymUseCaseRequest {
  userId: string;
}

@Injectable()
export class FetchClassesByGymUseCase {
  constructor(
    private classesRepository: ClassesRepository,
    private usersRepository: UsersRepository,
    private gymsRepository: GymsRepository,
    private trainingGymsRepository: TrainingGymsRepository,
  ) {}

  async execute(
    props: FetchClassesByGymUseCaseRequest,
  ): Promise<ClassWithDetails[]> {
    const { userId } = props;
    // Get user roles
    const userRoles = await this.usersRepository.findUserRolesByUserId(userId);
    if (userRoles.length === 0) {
      return [];
    }

    let gymId: string | null = null;
    // Check if user is a manager
    const isManager = userRoles.some((role) => role.role === Role.MANAGER);
    if (isManager) {
      // Find gym where user is the manager
      const gym = await this.gymsRepository.findByManagerId(userId);
      if (gym) {
        gymId = gym.id;
      }
    } else {
      // Find training gym associated with the user
      const trainingGym =
        await this.trainingGymsRepository.findByUserId(userId);
      if (trainingGym) {
        gymId = trainingGym.gymId;
      }
    }

    if (!gymId) {
      return [];
    }
    // Fetch classes for the gym
    const classes = await this.classesRepository.findByGymId(gymId);

    return classes;
  }
}
