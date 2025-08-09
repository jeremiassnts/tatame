import { Module } from '@nestjs/common';
import { PasswordHasherService } from 'src/domain/services/password-hasher.service';
import { TokenEncrypterService } from 'src/domain/services/token-encrypter.service';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from 'src/env/env.service';
import { DatabaseModule } from '../infra/repositories/database.module';
import { PrismaService } from '../infra/repositories/prisma/prisma.service';
import { BcryptHasher } from '../infra/services/bcrypt-hasher';
import { JwtEncrypter } from '../infra/services/jwt-encrypter';
import { AuthenticateController } from './auth/authenticate.controller';
import { AuthenticateUseCase } from 'src/domain/use-cases/authenticate';
import { ChangePasswordUseCase } from 'src/domain/use-cases/change-password';
import { ChangePasswordController } from './auth/change-password.controller';
import { CreateManagerController } from './manager/create-manager.controller';
import { CreateManagerUseCase } from 'src/domain/use-cases/create-manager';
import { CreateUserController } from './user/create-user.controller';
import { CreateUserUseCase } from 'src/domain/use-cases/create-user';
import { UploadPhotoUseCase } from 'src/domain/use-cases/upload-photo';
import { UploadPhotoController } from './attachment/upload-attachment.controller';
import { StorageModule } from '../infra/storage/storage.module';
import { FetchModalitiesController } from './modality/fetch-modalities.controller';
import { FetchModalitiesUseCase } from 'src/domain/use-cases/fetch-modalities';
import { FetchGraduationColorsController } from './graduation/fetch-graduation-colors.controller';
import { FetchGraduationColorsUseCase } from 'src/domain/use-cases/fetch-graduation-colors';
import { StripeController } from './stripe/stripe.controller';
import { StripeService } from '../infra/services/stripe';
import { FindUserByEmailController } from './user/find-user-by-email.controller';
import { FindUserByEmailUseCase } from 'src/domain/use-cases/find-user-by-email';
import { FetchGymsController } from './gym/fetch-gyms.controller';
import { FetchGymsUseCase } from 'src/domain/use-cases/fetch-gyms';
import { CreateInstructorController } from './instructor/create-instructor.controller';
import { CreateInstructorUseCase } from 'src/domain/use-cases/create-instructor';
import { CreateStudentController } from './student/create-student.controller';
import { CreateStudentUseCase } from 'src/domain/use-cases/create-student';
import { RequestChangePasswordController } from './auth/request-change-password.controller';
import { RequestChangePasswordUseCase } from 'src/domain/use-cases/request-change-password';
import { MailerService } from 'src/domain/services/mailer.service';
import { NodemailerService } from '../infra/services/nodemailer';
import { GetUserProfileController } from './user/get-user-profile.controller';
import { GetUserProfileUseCase } from 'src/domain/use-cases/get-user-profile';
import { CreateClassController } from './class/create-class.controller';
import { CreateClassUseCase } from 'src/domain/use-cases/create-class';
import { FetchClassesByGymController } from './class/fetch-classes-by-gym.controller';
import { FetchClassesByGymUseCase } from 'src/domain/use-cases/fetch-classes-by-gym';
import { FetchInstructorsByGymController } from './instructor/fetch-instructors-by-gym.controller';
import { FetchInstructorsByGymUseCase } from 'src/domain/use-cases/fetch-instructors-by-gym';
import { EditClassController } from './class/edit-class.controller';
import { EditClassUseCase } from 'src/domain/use-cases/edit-class';
import { DeleteClassController } from './class/delete-class.controller';
import { DeleteClassUseCase } from 'src/domain/use-cases/delete-class';
import { FetchClassByIdController } from './class/fetch-class-by-id.controller';
import { FetchClassByIdUseCase } from 'src/domain/use-cases/fetch-class-by-id';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [
    AuthenticateController,
    ChangePasswordController,
    CreateManagerController,
    CreateUserController,
    UploadPhotoController,
    FetchModalitiesController,
    FetchGraduationColorsController,
    StripeController,
    FindUserByEmailController,
    FetchGymsController,
    CreateInstructorController,
    CreateStudentController,
    RequestChangePasswordController,
    GetUserProfileController,
    CreateClassController,
    FetchClassesByGymController,
    FetchInstructorsByGymController,
    EditClassController,
    DeleteClassController,
    FetchClassByIdController,
  ],
  providers: [
    PrismaService,
    JwtService,
    EnvService,
    AuthenticateUseCase,
    ChangePasswordUseCase,
    CreateManagerUseCase,
    CreateUserUseCase,
    UploadPhotoUseCase,
    FetchModalitiesUseCase,
    FetchGraduationColorsUseCase,
    FindUserByEmailUseCase,
    FetchGymsUseCase,
    CreateInstructorUseCase,
    CreateStudentUseCase,
    RequestChangePasswordUseCase,
    GetUserProfileUseCase,
    CreateClassUseCase,
    FetchClassesByGymUseCase,
    FetchClassByIdUseCase,
    FetchInstructorsByGymUseCase,
    EditClassUseCase,
    DeleteClassUseCase,
    {
      provide: PasswordHasherService,
      useClass: BcryptHasher,
    },
    {
      provide: TokenEncrypterService,
      useClass: JwtEncrypter,
    },
    {
      provide: MailerService,
      useClass: NodemailerService,
    },
    StripeService,
  ],
})
export class ControllersModule {}
