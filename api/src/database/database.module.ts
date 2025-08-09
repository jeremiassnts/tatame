import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users.repository';
import { PrismaGraduationColorsRepository } from './prisma/repositories/prisma-graduation-colors.repository';
import { PrismaUserRolesRepository } from './prisma/repositories/prisma-user-roles.repository';
import { PrismaModalitiesRepository } from './prisma/repositories/prisma-modalities.repository';
import { PrismaGraduationsRepository } from './prisma/repositories/prisma-graduations.repository';
import { PrismaGymsRepository } from './prisma/repositories/prisma-gyms.repository';
import { UsersRepository } from './repositories/users.repository';
import { GraduationColorsRepository } from './repositories/graduation-colors.repository';
import { UserRolesRepository } from './repositories/user-roles.repository';
import { ModalitiesRepository } from './repositories/modalities.repository';
import { GraduationsRepository } from './repositories/graduations.repository';
import { GymsRepository } from './repositories/gyms.repository';
import { PrismaClassesRepository } from './prisma/repositories/prisma-classes.repository';
import { ClassesRepository } from './repositories/classes.repository';
import { TrainingGymsRepository } from './repositories/training-gyms.repository';
import { PrismaTrainingGymsRepository } from './prisma/repositories/prisma-training-gyms.repository';

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
