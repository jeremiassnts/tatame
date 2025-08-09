import { Module } from '@nestjs/common';
import { PasswordHasherService } from 'src/domain/services/password-hasher.service';
import { TokenEncrypterService } from 'src/domain/services/token-encrypter.service';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from 'src/env/env.service';
import { DatabaseModule } from '../repositories/database.module';
import { PrismaService } from '../repositories/prisma/prisma.service';
import { BcryptHasher } from '../services/bcrypt-hasher';
import { JwtEncrypter } from '../services/jwt-encrypter';
import { AuthenticateController } from './authenticate.controller';
import { AuthenticateUseCase } from 'src/domain/use-cases/authenticate';
import { ChangePasswordUseCase } from 'src/domain/use-cases/change-password';
import { ChangePasswordController } from './change-password.controller';
import { CreateManagerController } from './create-manager.controller';
import { CreateManagerUseCase } from 'src/domain/use-cases/create-manager';
import { CreateUserController } from './create-user.controller';
import { CreateUserUseCase } from 'src/domain/use-cases/create-user';
import { UploadPhotoUseCase } from 'src/domain/use-cases/upload-photo';
import { UploadPhotoController } from './upload-attachment.controller';
import { StorageModule } from '../storage/storage.module';
import { FetchModalitiesController } from './fetch-modalities.controller';
import { FetchModalitiesUseCase } from 'src/domain/use-cases/fetch-modalities';
import { FetchGraduationColorsController } from './fetch-graduation-colors.controller';
import { FetchGraduationColorsUseCase } from 'src/domain/use-cases/fetch-graduation-colors';
import { StripeController } from './stripe.controller';
import { StripeService } from '../services/stripe';
import { FindUserByEmailController } from './find-user-by-email.controller';
import { FindUserByEmailUseCase } from 'src/domain/use-cases/find-user-by-email';
import { FetchGymsController } from './fetch-gyms.controller';
import { FetchGymsUseCase } from 'src/domain/use-cases/fetch-gyms';
import { CreateInstructorController } from './create-instructor.controller';
import { CreateInstructorUseCase } from 'src/domain/use-cases/create-instructor';
import { CreateStudentController } from './create-student.controller';
import { CreateStudentUseCase } from 'src/domain/use-cases/create-student';
import { RequestChangePasswordController } from './request-change-password.controller';
import { RequestChangePasswordUseCase } from 'src/domain/use-cases/request-change-password';
import { MailerService } from 'src/domain/services/mailer.service';
import { NodemailerService } from '../services/nodemailer';
import { GetUserProfileController } from './get-user-profile.controller';
import { GetUserProfileUseCase } from 'src/domain/use-cases/get-user-profile';
import { CreateClassController } from './create-class.controller';
import { CreateClassUseCase } from 'src/domain/use-cases/create-class';
import { FetchClassesByGymController } from './fetch-classes-by-gym.controller';
import { FetchClassesByGymUseCase } from 'src/domain/use-cases/fetch-classes-by-gym';
import { FetchInstructorsByGymController } from './fetch-instructors-by-gym.controller';
import { FetchInstructorsByGymUseCase } from 'src/domain/use-cases/fetch-instructors-by-gym';
import { EditClassController } from './edit-class.controller';
import { EditClassUseCase } from 'src/domain/use-cases/edit-class';
import { DeleteClassController } from './delete-class.controller';
import { DeleteClassUseCase } from 'src/domain/use-cases/delete-class';
import { FetchClassByIdController } from './fetch-class-by-id.controller';
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
