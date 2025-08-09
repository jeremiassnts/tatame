import { Class } from '../../src/entities/class';
import { ClassWithDetails } from '../../src/entities/class-with-details';
import { ClassesRepository } from '../../src/database/repositories/classes.repository';

export class InMemoryClassesRepository implements ClassesRepository {
  public classes: Class[] = [];

  async create(classEntity: Class): Promise<void> {
    this.classes.push(classEntity);
    return Promise.resolve();
  }

  async findByGymId(gymId: string): Promise<ClassWithDetails[]> {
    const filteredClasses = this.classes.filter(
      (classEntity) => classEntity.gymId === gymId,
    );

    // Convert Class to ClassWithDetails with mock data
    const classWithDetails = filteredClasses.map(
      (classEntity) =>
        new ClassWithDetails({
          id: classEntity.id,
          name: classEntity.name,
          description: classEntity.description,
          timeStart: classEntity.timeStart,
          timeEnd: classEntity.timeEnd,
          dayOfWeek: classEntity.dayOfWeek,
          address: classEntity.address,
          active: classEntity.active,
          gymId: classEntity.gymId,
          userId: classEntity.userId,
          modalityId: classEntity.modalityId,
          gymName: 'Mock Gym',
          instructorName: 'Mock Instructor',
          modalityName: 'Mock Modality',
        }),
    );

    return Promise.resolve(classWithDetails);
  }

  async findById(id: string): Promise<Class | null> {
    const classEntity = this.classes.find(
      (classEntity) => classEntity.id === id,
    );
    return Promise.resolve(classEntity || null);
  }

  async save(classEntity: Class): Promise<void> {
    const index = this.classes.findIndex((c) => c.id === classEntity.id);
    if (index !== -1) {
      this.classes[index] = classEntity;
    }
    return Promise.resolve();
  }

  async delete(id: string): Promise<void> {
    const index = this.classes.findIndex(
      (classEntity) => classEntity.id === id,
    );
    if (index !== -1) {
      this.classes.splice(index, 1);
    }
    return Promise.resolve();
  }
  async findByIdWithDetails(id: string): Promise<ClassWithDetails | null> {
    const classEntity = this.classes.find(
      (classEntity) => classEntity.id === id,
    );
    if (!classEntity) {
      return null;
    }
    return Promise.resolve(
      new ClassWithDetails({
        id: classEntity.id,
        name: classEntity.name,
        description: classEntity.description,
        timeStart: classEntity.timeStart,
        timeEnd: classEntity.timeEnd,
        dayOfWeek: classEntity.dayOfWeek,
        address: classEntity.address,
        active: classEntity.active,
        gymId: classEntity.gymId,
        userId: classEntity.userId,
        modalityId: classEntity.modalityId,
        gymName: 'Mock Gym',
        instructorName: 'Mock Instructor',
        modalityName: 'Mock Modality',
      }),
    );
  }
}
