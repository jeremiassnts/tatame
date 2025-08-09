import { UserRole } from '../../src/domain/entities/user-role';
import { UserRolesRepository } from '../../src/domain/repositories/user-roles.repository';

export class InMemoryUserRolesRepository implements UserRolesRepository {
  public userRoles: UserRole[] = [];

  async create(userRole: UserRole): Promise<void> {
    this.userRoles.push(userRole);
    return Promise.resolve();
  }
}
