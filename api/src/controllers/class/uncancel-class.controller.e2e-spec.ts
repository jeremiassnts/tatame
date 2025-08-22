import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { UserFactory } from 'test/factories/make-user';
import { ClassFactory } from 'test/factories/make-class';
import { GymFactory } from 'test/factories/make-gym';
import { ModalityFactory } from 'test/factories/make-modality';
import { DatabaseModule } from '../../database/database.module';
import { PrismaService } from '../../database/prisma/prisma.service';
import { beforeAll, describe, expect, test } from 'vitest';

describe('Uncancel Class (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let userFactory: UserFactory;
  let classFactory: ClassFactory;
  let gymFactory: GymFactory;
  let modalityFactory: ModalityFactory;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ClassFactory, GymFactory, ModalityFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    userFactory = moduleRef.get(UserFactory);
    classFactory = moduleRef.get(ClassFactory);
    gymFactory = moduleRef.get(GymFactory);
    modalityFactory = moduleRef.get(ModalityFactory);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /classes/uncancel', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({ sub: user.id });

    const gym = await gymFactory.makePrismaGym({
      managerId: user.id,
    });
    const modality = await modalityFactory.makePrismaModality();
    const instructor = await userFactory.makePrismaUser();
    const classEntity = await classFactory.makePrismaClass({
      gymId: gym.id,
      modalityId: modality.id,
      userId: instructor.id,
    });

    const referenceDate = new Date('2024-01-15T08:00:00Z');

    // First, create a cancellation
    await prisma.classCancellation.create({
      data: {
        classId: classEntity.id,
        referenceDate,
        createdAt: new Date(),
      },
    });

    // Verify the cancellation exists
    const cancellationBefore = await prisma.classCancellation.findFirst({
      where: {
        classId: classEntity.id,
        referenceDate,
      },
    });
    expect(cancellationBefore).toBeTruthy();

    // Now uncancel the class
    const response = await request(app.getHttpServer())
      .post('/classes/uncancel')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        classId: classEntity.id,
        referenceDate: referenceDate.toISOString(),
      });

    expect(response.statusCode).toBe(201);

    // Verify the cancellation was removed from the database
    const cancellationAfter = await prisma.classCancellation.findFirst({
      where: {
        classId: classEntity.id,
        referenceDate,
      },
    });

    expect(cancellationAfter).toBeNull();
  });

  test('[POST] /classes/uncancel should return 404 when class does not exist', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({ sub: user.id });

    const referenceDate = new Date('2024-01-15T08:00:00Z');

    const response = await request(app.getHttpServer())
      .post('/classes/uncancel')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        classId: 'non-existent-class-id',
        referenceDate: referenceDate.toISOString(),
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Class not found');
  });

  test('[POST] /classes/uncancel should return 400 when class is not cancelled', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({ sub: user.id });

    const gym = await gymFactory.makePrismaGym({
      managerId: user.id,
    });
    const modality = await modalityFactory.makePrismaModality();
    const instructor = await userFactory.makePrismaUser();
    const classEntity = await classFactory.makePrismaClass({
      gymId: gym.id,
      modalityId: modality.id,
      userId: instructor.id,
    });

    const referenceDate = new Date('2024-01-15T08:00:00Z');

    const response = await request(app.getHttpServer())
      .post('/classes/uncancel')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        classId: classEntity.id,
        referenceDate: referenceDate.toISOString(),
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Class is not cancelled for this date');
  });
});
