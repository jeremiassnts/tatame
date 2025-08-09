import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../infra/app.module';
import { DatabaseModule } from '../../infra/repositories/database.module';
import { PrismaService } from '../../infra/repositories/prisma/prisma.service';
import { describe, expect, beforeAll, test } from 'vitest';
import { JwtService } from '@nestjs/jwt';
import { GymFactory } from 'test/factories/make-gym';
import { UserFactory } from 'test/factories/make-user';
import { ModalityFactory } from 'test/factories/make-modality';

describe('Create Class (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let userFactory: UserFactory;
  let gymsFactory: GymFactory;
  let modalityFactory: ModalityFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PrismaService, UserFactory, GymFactory, ModalityFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);
    userFactory = moduleRef.get(UserFactory);
    gymsFactory = moduleRef.get(GymFactory);
    modalityFactory = moduleRef.get(ModalityFactory);

    await app.init();
  });

  test('[POST] /classes - should create a class', async () => {
    // Create required entities first
    const user = await userFactory.makePrismaUser();
    const gym = await gymsFactory.makePrismaGym({ managerId: user.id });
    const modality = await modalityFactory.makePrismaModality();
    // Create JWT token for authentication
    const accessToken = jwtService.sign({ sub: user.id });

    const body = {
      name: 'Morning Jiu-Jitsu',
      description: 'Beginner friendly Jiu-Jitsu class',
      timeStart: new Date('2024-01-15T08:00:00Z'),
      timeEnd: new Date('2024-01-15T09:30:00Z'),
      daysOfWeek: ['MONDAY'],
      address: '123 Main St',
      active: true,
      gymId: gym.id,
      userId: user.id,
      modalityId: modality.id,
    };

    const response = await request(app.getHttpServer())
      .post('/classes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(body);

    const createdClass = await prismaService.class.findFirst();

    expect(response.statusCode).toEqual(201);
    expect(createdClass).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Morning Jiu-Jitsu',
        description: 'Beginner friendly Jiu-Jitsu class',
      }),
    );
  });
});
