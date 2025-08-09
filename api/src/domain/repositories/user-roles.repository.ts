import { UserRole } from '../entities/user-role';

export abstract class UserRolesRepository {
  abstract create(userRole: UserRole): Promise<void>;
}
