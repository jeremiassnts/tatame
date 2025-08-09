import { Injectable } from '@nestjs/common';
import { GraduationColor } from '../../../domain/entities/graduation-color';
import { GraduationColorsRepository } from '../../../domain/repositories/graduation-colors.repository';
import { PrismaService } from './prisma.service';
import { PrismaGraduationColorMapper } from '../../mappers/prisma/prisma-graduation-color.mapper';

@Injectable()
export class PrismaGraduationColorsRepository
  implements GraduationColorsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(graduationColor: GraduationColor): Promise<void> {
    const data = PrismaGraduationColorMapper.toPrisma(graduationColor);
    await this.prisma.graduationColor.create({ data });
  }

  async findByModalityId(modalityId: string): Promise<GraduationColor[]> {
    const colors = await this.prisma.graduationColor.findMany({
      where: { modalityId },
    });
    return colors.map((color) => PrismaGraduationColorMapper.toDomain(color));
  }
}
