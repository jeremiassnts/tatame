import { UsersRepository } from 'src/database/repositories/users.repository';
import { PasswordHasherService } from 'src/services/password-hasher.service';
import { Injectable } from '@nestjs/common';
import { Gender, User } from 'src/entities/user';
import { UserAlreadyExistsError } from './error/user-already-exists.error';
import { Graduation } from '../entities/graduation';
import { Role, UserRole } from '../entities/user-role';

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
  gender: Gender;
  birth: Date;
  authToken?: string;
  profilePhotoUrl?: string;
  role: Role;
  graduations: {
    colorId: string;
    modalityId: string;
    extraInfo: string;
  }[];
}
@Injectable()
export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasher: PasswordHasherService,
  ) {}
  async execute(props: CreateUserUseCaseRequest) {
    const { email } = props;
    const user = await this.usersRepository.findByEmail(email);
    if (user) {
      throw new UserAlreadyExistsError();
    }

    const { name, password, gender, birth, authToken, profilePhotoUrl } = props;
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
    });

    const { graduations } = props;
    const newGraduations = graduations.map(
      (graduation) =>
        new Graduation({
          colorId: graduation.colorId,
          modalityId: graduation.modalityId,
        }),
    );

    const { role } = props;
    const newRole = new UserRole({
      role,
    });

    await this.usersRepository.create(newUser, newGraduations, newRole);

    return {
      user: newUser,
      graduations: newGraduations,
    };
  }
}
