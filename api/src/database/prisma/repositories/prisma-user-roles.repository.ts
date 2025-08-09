import { Injectable } from '@nestjs/common';
import { UserRole } from '../../../entities/user-role';
import { UserRolesRepository } from '../../repositories/user-roles.repository';
import { PrismaService } from '../prisma.service';
import { PrismaUserRoleMapper } from 'src/database/prisma/mappers/prisma-user-role.mapper';

@Injectable()
export class PrismaUserRolesRepository implements UserRolesRepository {
  constructor(private prisma: PrismaService) {}

  async create(userRole: UserRole): Promise<void> {
    const data = PrismaUserRoleMapper.toPrisma(userRole);
    await this.prisma.userRole.create({ data });
  }
}
