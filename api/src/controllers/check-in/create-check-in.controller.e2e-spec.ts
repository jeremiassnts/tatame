import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { DatabaseModule } from '../../database/database.module';
import { PrismaService } from '../../database/prisma/prisma.service';
import { describe, expect, beforeAll, test } from 'vitest';
import { JwtService } from '@nestjs/jwt';
import { UserFactory } from 'test/factories/make-user';
import { ClassFactory } from 'test/factories/make-class';
import { GymFactory } from 'test/factories/make-gym';
import { ModalityFactory } from 'test/factories/make-modality';

describe('Create Check-in (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let userFactory: UserFactory;
  let classFactory: ClassFactory;
  let gymsFactory: GymFactory;
  let modalityFactory: ModalityFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        PrismaService,
        UserFactory,
        ClassFactory,
        GymFactory,
        ModalityFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);
    userFactory = moduleRef.get(UserFactory);
    classFactory = moduleRef.get(ClassFactory);
    gymsFactory = moduleRef.get(GymFactory);
    modalityFactory = moduleRef.get(ModalityFactory);

    await app.init();
  });

  test('[POST] /check-ins - should create a check-in', async () => {
    // Create required entities first
    const user = await userFactory.makePrismaUser();
    const gym = await gymsFactory.makePrismaGym({ managerId: user.id });
    const modality = await modalityFactory.makePrismaModality();
    const classEntity = await classFactory.makePrismaClass({
      gymId: gym.id,
      userId: user.id,
      modalityId: modality.id,
    });

    // Create JWT token for authentication
    const accessToken = jwtService.sign({ sub: user.id });
    const body = {
      classId: classEntity.id,
      referenceDate: new Date('2024-01-15'),
    };

    const response = await request(app.getHttpServer())
      .post('/check-ins')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(body);

    const createdCheckIn = await prismaService.checkIn.findFirst();

    expect(response.statusCode).toEqual(201);
    expect(createdCheckIn).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        classId: classEntity.id,
        userId: user.id,
        createdAt: expect.any(Date),
        referenceDate: expect.any(Date),
      }),
    );
  });
});
