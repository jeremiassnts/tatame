import { CheckIn } from '../../entities/check-in';

export abstract class CheckInRepository {
  abstract create(checkIn: CheckIn): Promise<void>;
  abstract findByClassId(classId: string): Promise<CheckIn[]>;
  abstract findByClassIdAndUserId(
    classId: string,
    userId: string,
  ): Promise<CheckIn | null>;
  abstract findByClassIdUserIdAndReferenceDate(
    classId: string,
    userId: string,
    referenceDate: Date,
  ): Promise<CheckIn | null>;
  abstract deleteByClassIdAndUserId(
    classId: string,
    userId: string,
  ): Promise<void>;
}
