import { InMemoryUsersRepository } from 'test/repositories/in-memory-users.repository';
import { beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { InMemoryGraduationsRepository } from 'test/repositories/in-memory-graduations.repository';
import { InMemoryUserRolesRepository } from 'test/repositories/in-memory-user-roles.repository';
import { InMemoryGymsRepository } from 'test/repositories/in-memory-gyms.repository';
import { RequestChangePasswordUseCase } from './request-change-password';
import { EnvService } from 'src/env/env.service';
import { FakeMailerService } from 'test/services/fake-mailer';
import { InMemoryTrainingGymsRepository } from 'test/repositories/in-memory-training-gyms.repository';
import { ConfigService } from '@nestjs/config';
import { makeUser } from 'test/factories/make-user';
import { FakeEncrypter } from 'test/services/fake-encrypter';

let graduationsRepository: InMemoryGraduationsRepository;
let userRolesRepository: InMemoryUserRolesRepository;
let gymsRepository: InMemoryGymsRepository;
let usersRepository: InMemoryUsersRepository;
let trainingGymsRepository: InMemoryTrainingGymsRepository;
let envService: EnvService;
let mailerService: FakeMailerService;
let tokenEncrypter: FakeEncrypter;
let sut: RequestChangePasswordUseCase;
let sendMailSpy: MockInstance;

describe('Request Change Password Use Case', () => {
  beforeEach(() => {
    graduationsRepository = new InMemoryGraduationsRepository();
    userRolesRepository = new InMemoryUserRolesRepository();
    gymsRepository = new InMemoryGymsRepository();
    trainingGymsRepository = new InMemoryTrainingGymsRepository();
    usersRepository = new InMemoryUsersRepository(
      graduationsRepository,
      gymsRepository,
      userRolesRepository,
      trainingGymsRepository,
    );
    envService = new EnvService(new ConfigService());
    mailerService = new FakeMailerService();
    sendMailSpy = vi.spyOn(mailerService, 'sendMail');
    tokenEncrypter = new FakeEncrypter();

    sut = new RequestChangePasswordUseCase(
      usersRepository,
      tokenEncrypter,
      envService,
      mailerService,
    );
  });

  it('should send email to user request change password', async () => {
    const user = makeUser();
    usersRepository.users.push(user);
    await sut.execute({
      email: user.email,
    });
    expect(sendMailSpy).toHaveBeenCalled();
  });
  it('should not send email to user if user does not exist', async () => {
    await sut.execute({
      email: 'nonexistent@example.com',
    });
    expect(sendMailSpy).not.toHaveBeenCalled();
  });
});
