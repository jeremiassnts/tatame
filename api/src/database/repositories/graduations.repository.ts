import { Graduation } from '../../entities/graduation';

export abstract class GraduationsRepository {
  abstract create(graduation: Graduation): Promise<void>;
}
