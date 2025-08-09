import { Injectable } from '@nestjs/common';
import { Graduation } from '../../../domain/entities/graduation';
import { GraduationsRepository } from '../../../domain/repositories/graduations.repository';
import { PrismaService } from './prisma.service';
import { PrismaGraduationMapper } from '../../mappers/prisma/prisma-graduation.mapper';

@Injectable()
export class PrismaGraduationsRepository implements GraduationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(graduation: Graduation): Promise<void> {
    const data = PrismaGraduationMapper.toPrisma(graduation);
    await this.prisma.graduation.create({ data });
  }
}
