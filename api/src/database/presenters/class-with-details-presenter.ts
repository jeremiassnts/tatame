import { ClassWithDetails } from 'src/entities/class-with-details';

export class ClassWithDetailsPresenter {
  static toHttp(classEntity: ClassWithDetails) {
    return {
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
      gymName: classEntity.gymName,
      instructorName: classEntity.instructorName,
      modalityName: classEntity.modalityName,
    };
  }
}
