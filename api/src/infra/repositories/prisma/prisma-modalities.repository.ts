import { Injectable } from '@nestjs/common';
import { Modality } from '../../../domain/entities/modality';
import { ModalitiesRepository } from '../../../domain/repositories/modalities.repository';
import { PrismaService } from './prisma.service';
import { PrismaModalityMapper } from '../../mappers/prisma/prisma-modality.mapper';

@Injectable()
export class PrismaModalitiesRepository implements ModalitiesRepository {
  constructor(private prisma: PrismaService) {}

  async create(modality: Modality): Promise<void> {
    const data = PrismaModalityMapper.toPrisma(modality);
    await this.prisma.modality.create({ data });
  }

  async findAll(): Promise<Modality[]> {
    const modalities = await this.prisma.modality.findMany();
    return modalities.map((modality) =>
      PrismaModalityMapper.toDomain(modality),
    );
  }

  async findById(id: string): Promise<Modality | null> {
    const modality = await this.prisma.modality.findUnique({
      where: { id },
    });
    if (!modality) return null;
    return PrismaModalityMapper.toDomain(modality);
  }
}
