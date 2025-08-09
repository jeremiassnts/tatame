import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../database/repositories/users.repository';
import { PasswordHasherService } from '../services/password-hasher.service';
import { Gender, User } from '../entities/user';
import { UserAlreadyExistsError } from './error/user-already-exists.error';
import { Graduation } from '../entities/graduation';
import { TrainingGym } from '../entities/training-gym';

interface CreateStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
  gender: Gender;
  birth: Date;
  authToken?: string;
  profilePhotoUrl?: string;
  gymId: string;
  graduations: {
    colorId: string;
    modalityId: string;
    extraInfo: string;
  }[];
}

@Injectable()
export class CreateStudentUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasher: PasswordHasherService,
  ) {}

  async execute(props: CreateStudentUseCaseRequest) {
    const { email } = props;
    const user = await this.usersRepository.findByEmail(email);
    if (user) {
      throw new UserAlreadyExistsError();
    }

    const { name, password, gender, birth, authToken, profilePhotoUrl, gymId } =
      props;

    const hashedPassword = await this.passwordHasher.hash(password);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      authorized: false,
      birth,
      gender,
      authToken,
      profilePhotoUrl,
      createdAt: new Date(),
    });

    const { graduations } = props;
    const newGraduations = graduations.map(
      (graduation) =>
        new Graduation({
          colorId: graduation.colorId,
          modalityId: graduation.modalityId,
          extraInfo: graduation.extraInfo,
        }),
    );

    const trainingGym = new TrainingGym({
      gymId,
      createdAt: new Date(),
    });

    await this.usersRepository.createStudentWithGraduations(
      newUser,
      newGraduations,
      trainingGym,
    );

    return {
      user: newUser,
      graduations: newGraduations,
      trainingGym,
    };
  }
}
