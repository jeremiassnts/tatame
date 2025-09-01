import { Injectable } from '@nestjs/common';
import { Class } from '../../../entities/class';
import { ClassesRepository } from '../../repositories/classes.repository';
import { PrismaService } from '../prisma.service';
import { PrismaClassMapper } from '../mappers/prisma-class.mapper';
import { ClassWithDetails } from 'src/entities/class-with-details';

@Injectable()
export class PrismaClassesRepository implements ClassesRepository {
  constructor(private prisma: PrismaService) {}

  async create(classEntity: Class): Promise<void> {
    const data = PrismaClassMapper.toPrisma(classEntity);
    await this.prisma.class.create({ data });
  }

  async findByGymId(gymId: string): Promise<ClassWithDetails[]> {
    const classes = await this.prisma.class.findMany({
      where: { gymId },
      orderBy: [{ dayOfWeek: 'asc' }, { timeStart: 'asc' }],
      include: {
        modality: true,
        gym: true,
        instructor: true,
        ClassCancellation: true,
        CheckIn: true,
      },
    });
    return classes.map((classEntity) =>
      PrismaClassMapper.toDomainWithDetails(classEntity),
    );
  }

  async findById(id: string): Promise<Class | null> {
    const classEntity = await this.prisma.class.findUnique({
      where: { id },
    });

    if (!classEntity) {
      return null;
    }

    return PrismaClassMapper.toDomain(classEntity);
  }

  async save(classEntity: Class): Promise<void> {
    const data = PrismaClassMapper.toPrisma(classEntity);
    await this.prisma.class.update({
      where: { id: classEntity.id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.class.delete({
      where: { id },
    });
  }

  async findByIdWithDetails(id: string): Promise<ClassWithDetails | null> {
    const classEntity = await this.prisma.class.findUnique({
      where: { id },
      include: {
        modality: true,
        gym: true,
        instructor: true,
        ClassCancellation: true,
        CheckIn: true,
      },
    });
    if (!classEntity) {
      return null;
    }
    return PrismaClassMapper.toDomainWithDetails(classEntity);
  }
}
