import { CheckIn } from '../../src/entities/check-in';
import { CheckInRepository } from '../../src/database/repositories/check-in.repository';

export class InMemoryCheckInRepository implements CheckInRepository {
  public checkIns: CheckIn[] = [];

  async create(checkIn: CheckIn): Promise<void> {
    this.checkIns.push(checkIn);
    return Promise.resolve();
  }

  async findByClassId(classId: string): Promise<CheckIn[]> {
    return Promise.resolve(
      this.checkIns.filter((checkIn) => checkIn.classId === classId),
    );
  }

  async findByClassIdAndUserId(
    classId: string,
    userId: string,
  ): Promise<CheckIn | null> {
    const checkIn = this.checkIns.find(
      (checkIn) => checkIn.classId === classId && checkIn.userId === userId,
    );

    return Promise.resolve(checkIn || null);
  }

  async findByClassIdUserIdAndReferenceDate(
    classId: string,
    userId: string,
    referenceDate: Date,
  ): Promise<CheckIn | null> {
    const checkIn = this.checkIns.find(
      (checkIn) =>
        checkIn.classId === classId &&
        checkIn.userId === userId &&
        this.isSameDay(checkIn.referenceDate, referenceDate),
    );

    return Promise.resolve(checkIn || null);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  async deleteByClassIdAndUserId(
    classId: string,
    userId: string,
  ): Promise<void> {
    const index = this.checkIns.findIndex(
      (checkIn) => checkIn.classId === classId && checkIn.userId === userId,
    );

    if (index >= 0) {
      this.checkIns.splice(index, 1);
    }
    return Promise.resolve();
  }
}
