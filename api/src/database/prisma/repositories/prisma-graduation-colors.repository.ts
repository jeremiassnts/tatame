import { Injectable } from '@nestjs/common';
import { GraduationColor } from '../../../entities/graduation-color';
import { GraduationColorsRepository } from '../../repositories/graduation-colors.repository';
import { PrismaService } from '../prisma.service';
import { PrismaGraduationColorMapper } from 'src/database/prisma/mappers/prisma-graduation-color.mapper';

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
