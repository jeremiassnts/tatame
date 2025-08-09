import { Injectable } from '@nestjs/common';
import { Gym } from '../../../entities/gym';
import { GymsRepository } from '../../repositories/gyms.repository';
import { PrismaService } from '../prisma.service';
import { PrismaGymMapper } from 'src/database/prisma/mappers/prisma-gym.mapper';

@Injectable()
export class PrismaGymsRepository implements GymsRepository {
  constructor(private prisma: PrismaService) {}

  async create(gym: Gym): Promise<void> {
    const data = PrismaGymMapper.toPrisma(gym);
    await this.prisma.gym.create({ data });
  }

  async findAll(): Promise<Gym[]> {
    const gyms = await this.prisma.gym.findMany({
      orderBy: { name: 'asc' },
    });
    return gyms.map((gym) => PrismaGymMapper.toDomain(gym));
  }

  async findByManagerId(managerId: string): Promise<Gym | null> {
    const gym = await this.prisma.gym.findUnique({
      where: { managerId },
    });
    return gym ? PrismaGymMapper.toDomain(gym) : null;
  }
}
