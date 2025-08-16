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
        cancellation.referenceDate.getTime() === referenceDate.getTime(),
    );

    return Promise.resolve(cancellation || null);
  }
}
