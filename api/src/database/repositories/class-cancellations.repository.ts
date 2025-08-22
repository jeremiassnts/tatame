import { ClassCancellation } from 'src/entities/class-cancellation';

export abstract class ClassCancellationsRepository {
  abstract create(classCancellation: ClassCancellation): Promise<void>;
  abstract findByClassIdAndDate(
    classId: string,
    referenceDate: Date,
  ): Promise<ClassCancellation | null>;
  abstract deleteByClassIdAndDate(
    classId: string,
    referenceDate: Date,
  ): Promise<void>;
}
