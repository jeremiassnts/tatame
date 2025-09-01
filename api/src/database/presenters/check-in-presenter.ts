import { CheckIn } from '../../entities/check-in';

export class CheckInPresenter {
  static toHttp(checkIn: CheckIn) {
    return {
      id: checkIn.id,
      classId: checkIn.classId,
      userId: checkIn.userId,
      createdAt: checkIn.createdAt,
      referenceDate: checkIn.referenceDate,
    };
  }
}
