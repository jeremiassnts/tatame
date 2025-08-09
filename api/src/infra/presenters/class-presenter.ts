import { Class } from 'src/domain/entities/class';

export class ClassPresenter {
  static toHttp(classEntity: Class) {
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
    };
  }
}
