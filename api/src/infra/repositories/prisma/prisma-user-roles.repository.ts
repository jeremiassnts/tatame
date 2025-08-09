import { Injectable } from '@nestjs/common';
import { UserRole } from '../../../domain/entities/user-role';
import { UserRolesRepository } from '../../../domain/repositories/user-roles.repository';
import { PrismaService } from './prisma.service';
import { PrismaUserRoleMapper } from '../../mappers/prisma/prisma-user-role.mapper';

@Injectable()
export class PrismaUserRolesRepository implements UserRolesRepository {
  constructor(private prisma: PrismaService) {}

  async create(userRole: UserRole): Promise<void> {
    const data = PrismaUserRoleMapper.toPrisma(userRole);
    await this.prisma.userRole.create({ data });
  }
}
