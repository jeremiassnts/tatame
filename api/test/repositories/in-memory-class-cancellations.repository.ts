import { isSameDay } from 'date-fns';
import { ClassCancellationsRepository } from 'src/database/repositories/class-cancellations.repository';
import { ClassCancellation } from 'src/entities/class-cancellation';

export class InMemoryClassCancellationsRepository extends ClassCancellationsRepository {
  public classCancellations: ClassCancellation[] = [];

  async create(classCancellation: ClassCancellation): Promise<void> {
    this.classCancellations.push(classCancellation);
    return Promise.resolve();
  }

  async findByClassIdAndDate(
    classId: string,
    referenceDate: Date,
  ): Promise<ClassCancellation | null> {
    const cancellation = this.classCancellations.find(
      (cancellation) =>
        cancellation.classId === classId &&
        isSameDay(cancellation.referenceDate, referenceDate),
    );

    return Promise.resolve(cancellation || null);
  }

  async deleteByClassIdAndDate(
    classId: string,
    referenceDate: Date,
  ): Promise<void> {
    const index = this.classCancellations.findIndex(
      (cancellation) =>
        cancellation.classId === classId &&
        isSameDay(cancellation.referenceDate, referenceDate),
    );

    if (index !== -1) {
      this.classCancellations.splice(index, 1);
    }

    return Promise.resolve();
  }
}
