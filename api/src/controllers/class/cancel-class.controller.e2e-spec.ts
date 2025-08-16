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

describe('Cancel Class (E2E)', () => {
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

  test('[POST] /classes/:id/cancel', async () => {
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
      .post(`/classes/${classEntity.id}/cancel`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        referenceDate: referenceDate.toISOString(),
      });

    expect(response.statusCode).toBe(201);

    // Verify the cancellation was created in the database
    const classCancellation = await prisma.classCancellation.findFirst({
      where: {
        classId: classEntity.id,
        referenceDate,
      },
    });

    expect(classCancellation).toBeTruthy();
    expect(classCancellation?.classId).toBe(classEntity.id);
    expect(classCancellation?.referenceDate).toEqual(referenceDate);
  });
});
