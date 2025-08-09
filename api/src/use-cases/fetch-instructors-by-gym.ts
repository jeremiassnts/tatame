import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { UsersRepository } from '../database/repositories/users.repository';

interface FetchInstructorsByGymUseCaseRequest {
  gymId: string;
}

interface FetchInstructorsByGymUseCaseResponse {
  instructors: User[];
}

@Injectable()
export class FetchInstructorsByGymUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    gymId,
  }: FetchInstructorsByGymUseCaseRequest): Promise<FetchInstructorsByGymUseCaseResponse> {
    const instructors =
      await this.usersRepository.findManyInstructorsByGymId(gymId);

    return {
      instructors,
    };
  }
}
