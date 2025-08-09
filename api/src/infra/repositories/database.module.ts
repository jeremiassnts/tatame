import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUsersRepository } from './prisma/prisma-users.repository';
import { PrismaGraduationColorsRepository } from './prisma/prisma-graduation-colors.repository';
import { PrismaUserRolesRepository } from './prisma/prisma-user-roles.repository';
import { PrismaModalitiesRepository } from './prisma/prisma-modalities.repository';
import { PrismaGraduationsRepository } from './prisma/prisma-graduations.repository';
import { PrismaGymsRepository } from './prisma/prisma-gyms.repository';
import { UsersRepository } from '../../domain/repositories/users.repository';
import { GraduationColorsRepository } from '../../domain/repositories/graduation-colors.repository';
import { UserRolesRepository } from '../../domain/repositories/user-roles.repository';
import { ModalitiesRepository } from '../../domain/repositories/modalities.repository';
import { GraduationsRepository } from '../../domain/repositories/graduations.repository';
import { GymsRepository } from '../../domain/repositories/gyms.repository';
import { PrismaClassesRepository } from './prisma/prisma-classes.repository';
import { ClassesRepository } from '../../domain/repositories/classes.repository';
import { TrainingGymsRepository } from 'src/domain/repositories/training-gyms.repository';
import { PrismaTrainingGymsRepository } from './prisma/prisma-training-gyms.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: GraduationColorsRepository,
      useClass: PrismaGraduationColorsRepository,
    },
    {
      provide: UserRolesRepository,
      useClass: PrismaUserRolesRepository,
    },
    {
      provide: ModalitiesRepository,
      useClass: PrismaModalitiesRepository,
    },
    {
      provide: GraduationsRepository,
      useClass: PrismaGraduationsRepository,
    },
    {
      provide: GymsRepository,
      useClass: PrismaGymsRepository,
    },
    {
      provide: ClassesRepository,
      useClass: PrismaClassesRepository,
    },
    {
      provide: TrainingGymsRepository,
      useClass: PrismaTrainingGymsRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    GraduationColorsRepository,
    UserRolesRepository,
    ModalitiesRepository,
    GraduationsRepository,
    GymsRepository,
    ClassesRepository,
    TrainingGymsRepository,
  ],
})
export class DatabaseModule {}
