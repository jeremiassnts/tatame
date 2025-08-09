import { Class } from '../entities/class';
import { ClassWithDetails } from '../entities/class-with-details';

export abstract class ClassesRepository {
  abstract create(classEntity: Class): Promise<void>;
  abstract findByGymId(gymId: string): Promise<ClassWithDetails[]>;
  abstract findById(id: string): Promise<Class | null>;
  abstract save(classEntity: Class): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findByIdWithDetails(id: string): Promise<ClassWithDetails | null>;
}
