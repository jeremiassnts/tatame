import { UserRole as PrismaUserRole, Prisma } from '@prisma/client';
import { UserRole, Role } from '../../../entities/user-role';

export class PrismaUserRoleMapper {
  static toDomain(raw: PrismaUserRole): UserRole {
    return new UserRole({
      id: raw.id,
      userId: raw.userId,
      role: raw.role as Role,
    });
  }

  static toPrisma(userRole: UserRole): Prisma.UserRoleUncheckedCreateInput {
    return {
      id: userRole.id,
      userId: userRole.userId ?? '',
      role: userRole.role,
    };
  }
}
