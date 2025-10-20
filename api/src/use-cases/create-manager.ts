import { UsersRepository } from 'src/database/repositories/users.repository';
import { PasswordHasherService } from 'src/services/password-hasher.service';
import { Injectable } from '@nestjs/common';
import { Gender, User } from 'src/entities/user';
import { UserAlreadyExistsError } from './error/user-already-exists.error';
import { Gym } from '../entities/gym';
import { Graduation } from '../entities/graduation';

interface CreateManagerUseCaseRequest {
  name: string;
  email: string;
  password: string;
  gender: Gender;
  birth: Date;
  authToken?: string;
  profilePhotoUrl?: string;
  // isInstructor: boolean;
  gymName: string;
  gymAddress: string;
  gymLogo: string;
  gymSince: Date;
  graduations: {
    colorId: string;
    modalityId: string;
    extraInfo: string;
  }[];
  // customerId: string;
}
@Injectable()
export class CreateManagerUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasher: PasswordHasherService,
  ) {}
  async execute(props: CreateManagerUseCaseRequest) {
    const { email } = props;
    const user = await this.usersRepository.findByEmail(email);
    if (user) {
      throw new UserAlreadyExistsError();
    }

    const {
      name,
      password,
      gender,
      birth,
      authToken,
      profilePhotoUrl,
      // customerId,
    } = props;
    const hashedPassword = await this.passwordHasher.hash(password);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      authorized: false,
      birth,
      gender,
      createdAt: new Date(),
      authToken,
      profilePhotoUrl,
      // stripeCustomerId: customerId,
    });

    const { gymName, gymAddress, gymLogo, gymSince } = props;
    const newGym = new Gym({
      name: gymName,
      address: gymAddress,
      logo: gymLogo,
      since: gymSince,
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
    await this.usersRepository.createManagerWithGymAndGraduations(
      newUser,
      newGym,
      newGraduations,
    );

    return {
      user: newUser,
      gym: newGym,
      graduations: newGraduations,
    };
  }
}
