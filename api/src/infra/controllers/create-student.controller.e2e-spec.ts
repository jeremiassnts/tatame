import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../repositories/prisma/prisma.service';
import { Gender } from '../../domain/entities/user';
import { AppModule } from '../app.module';
import { beforeAll, describe, expect, it } from 'vitest';
import { GymFactory } from 'test/factories/make-gym';
import { DatabaseModule } from '../repositories/database.module';
import { UserFactory } from 'test/factories/make-user';

describe('Create Student (E2E)', () => {
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

  it('should create a student', async () => {
    const user = await userFactory.makePrismaUser();
    const gym = await gymFactory.makePrismaGym({
      managerId: user.id,
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
      .post('/students')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
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
      });

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
    expect(userOnDatabase?.userRoles[0].role).toBe('STUDENT');
    expect(userOnDatabase?.TrainingGym[0].gymId).toBe(gym.id);
  });
});
