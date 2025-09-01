import { Injectable } from '@nestjs/common';
import { CheckIn } from '../entities/check-in';
import { CheckInRepository } from '../database/repositories/check-in.repository';

interface CreateCheckInUseCaseRequest {
  classId: string;
  userId: string;
  referenceDate: Date;
}

@Injectable()
export class CreateCheckInUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute(props: CreateCheckInUseCaseRequest) {
    const { classId, userId, referenceDate } = props;

    // Check if user is already checked in for this class on this specific date
    const existingCheckIn =
      await this.checkInRepository.findByClassIdUserIdAndReferenceDate(
        classId,
        userId,
        referenceDate,
      );

    if (existingCheckIn) {
      throw new Error('User is already checked in for this class on this date');
    }

    const checkIn = new CheckIn({
      classId,
      userId,
      createdAt: new Date(),
      referenceDate,
    });

    await this.checkInRepository.create(checkIn);

    return {
      checkIn,
    };
  }
}
