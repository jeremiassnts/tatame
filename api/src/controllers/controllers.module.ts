import { Module } from '@nestjs/common';
import { PasswordHasherService } from 'src/services/password-hasher.service';
import { TokenEncrypterService } from 'src/services/token-encrypter.service';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from 'src/env/env.service';
import { DatabaseModule } from '../database/database.module';
import { PrismaService } from '../database/prisma/prisma.service';
import { BcryptHasher } from '../hasher/bcrypt-hasher';
import { JwtEncrypter } from '../hasher/jwt-encrypter';
import { AuthenticateController } from './auth/authenticate.controller';
import { AuthenticateUseCase } from 'src/use-cases/authenticate';
import { ChangePasswordUseCase } from 'src/use-cases/change-password';
import { ChangePasswordController } from './auth/change-password.controller';
import { CreateManagerController } from './manager/create-manager.controller';
import { CreateManagerUseCase } from 'src/use-cases/create-manager';
import { CreateUserController } from './user/create-user.controller';
import { CreateUserUseCase } from 'src/use-cases/create-user';
import { UploadPhotoUseCase } from 'src/use-cases/upload-photo';
import { UploadPhotoController } from './attachment/upload-attachment.controller';
import { StorageModule } from '../storage/storage.module';
import { FetchModalitiesController } from './modality/fetch-modalities.controller';
import { FetchModalitiesUseCase } from 'src/use-cases/fetch-modalities';
import { FetchGraduationColorsController } from './graduation/fetch-graduation-colors.controller';
import { FetchGraduationColorsUseCase } from 'src/use-cases/fetch-graduation-colors';
import { StripeController } from './stripe/stripe.controller';
import { StripeService } from '../stripe/stripe.service';
import { FindUserByEmailController } from './user/find-user-by-email.controller';
import { FindUserByEmailUseCase } from 'src/use-cases/find-user-by-email';
import { FetchGymsController } from './gym/fetch-gyms.controller';
import { FetchGymsUseCase } from 'src/use-cases/fetch-gyms';
import { CreateInstructorController } from './instructor/create-instructor.controller';
import { CreateInstructorUseCase } from 'src/use-cases/create-instructor';
import { CreateStudentController } from './student/create-student.controller';
import { CreateStudentUseCase } from 'src/use-cases/create-student';
import { RequestChangePasswordController } from './auth/request-change-password.controller';
import { RequestChangePasswordUseCase } from 'src/use-cases/request-change-password';
import { MailerService } from 'src/services/mailer.service';
import { NodemailerService } from '../mailer/nodemailer';
import { GetUserProfileController } from './user/get-user-profile.controller';
import { GetUserProfileUseCase } from 'src/use-cases/get-user-profile';
import { CreateClassController } from './class/create-class.controller';
import { CreateClassUseCase } from 'src/use-cases/create-class';
import { FetchClassesByGymController } from './class/fetch-classes-by-gym.controller';
import { FetchClassesByGymUseCase } from 'src/use-cases/fetch-classes-by-gym';
import { FetchInstructorsByGymController } from './instructor/fetch-instructors-by-gym.controller';
import { FetchInstructorsByGymUseCase } from 'src/use-cases/fetch-instructors-by-gym';
import { EditClassController } from './class/edit-class.controller';
import { EditClassUseCase } from 'src/use-cases/edit-class';
import { DeleteClassController } from './class/delete-class.controller';
import { DeleteClassUseCase } from 'src/use-cases/delete-class';
import { FetchClassByIdController } from './class/fetch-class-by-id.controller';
import { FetchClassByIdUseCase } from 'src/use-cases/fetch-class-by-id';
import { CancelClassController } from './class/cancel-class.controller';
import { CancelClassUseCase } from 'src/use-cases/cancel-class';
import { UncancelClassController } from './class/uncancel-class.controller';
import { UncancelClassUseCase } from 'src/use-cases/uncancel-class';
import { CreateCheckInController } from './check-in/create-check-in.controller';
import { CreateCheckInUseCase } from 'src/use-cases/create-check-in';

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
    CancelClassController,
    UncancelClassController,
    CreateCheckInController,
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
    CancelClassUseCase,
    UncancelClassUseCase,
    CreateCheckInUseCase,
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
