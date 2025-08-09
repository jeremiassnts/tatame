import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Gender } from '../../entities/user';
import { GymFactory } from '../../../test/factories/make-gym';
import { beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../../app.module';
import { DatabaseModule } from '../../database/database.module';
import { UserFactory } from 'test/factories/make-user';

describe('Create Instructor (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let gymFactory: GymFactory;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [GymFactory, UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    gymFactory = moduleRef.get(GymFactory);
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });
  it('should create an instructor', async () => {
    const manager = await userFactory.makePrismaUser();
    const gym = await gymFactory.makePrismaGym({
      managerId: manager.id,
    });
    const modality = await prisma.modality.create({
      data: {
        id: 'fake-modality-id',
        name: 'fake-modality-name',
        type: 'BELT',
      },
    });
    const color = await prisma.graduationColor.create({
      data: {
        id: 'fake-color-id',
        name: 'fake-color-name',
        modalityId: modality.id,
      },
    });

    const response = await request(app.getHttpServer())
      .post('/instructors')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456789',
        gender: Gender.MALE,
        birth: new Date('1990-01-01'),
        gymId: gym.id,
        graduations: [
          {
            colorId: color.id,
            modalityId: modality.id,
            extraInfo: 'fake-extra-info',
          },
        ],
        authToken: 'fake-auth-token',
        profilePhotoUrl: 'fake-profile-photo-url',
      });

    console.log(response.body.errors);

    expect(response.status).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'john@example.com',
      },
      include: {
        userRoles: true,
        TrainingGym: true,
      },
    });

    expect(userOnDatabase).toBeTruthy();
    expect(userOnDatabase?.authorized).toBe(false);
    expect(userOnDatabase?.userRoles[0].role).toBe('INSTRUCTOR');
    expect(userOnDatabase?.TrainingGym[0].gymId).toBe(gym.id);
  });
});
