import { ClassCancellation } from 'src/entities/class-cancellation';

export class ClassCancellationPresenter {
  static toHttp(classCancellation: ClassCancellation) {
    return {
      id: classCancellation.id,
      classId: classCancellation.classId,
      referenceDate: classCancellation.referenceDate,
      createdAt: classCancellation.createdAt,
    };
  }
}
