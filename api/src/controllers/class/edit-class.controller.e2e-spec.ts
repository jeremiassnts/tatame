import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../infra/app.module';
import { UserFactory } from 'test/factories/make-user';
import { ClassFactory } from 'test/factories/make-class';
import { GymFactory } from 'test/factories/make-gym';
import { ModalityFactory } from 'test/factories/make-modality';
import { DatabaseModule } from '../../infra/repositories/database.module';
import { DayOfWeek } from 'src/domain/entities/class';
import { beforeAll, describe, expect, test } from 'vitest';

describe('Edit Class (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let userFactory: UserFactory;
  let classFactory: ClassFactory;
  let gymFactory: GymFactory;
  let modalityFactory: ModalityFactory;

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

    await app.init();
  });

  test('[PUT] /classes/:id', async () => {
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

    const newModality = await modalityFactory.makePrismaModality();
    const newInstructor = await userFactory.makePrismaUser();

    const response = await request(app.getHttpServer())
      .put(`/classes/${classEntity.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Updated Class Name',
        description: 'Updated Class Description',
        timeStart: '2023-12-01T10:00:00.000Z',
        timeEnd: '2023-12-01T11:00:00.000Z',
        dayOfWeek: DayOfWeek.MONDAY,
        userId: newInstructor.id,
        address: 'Updated Address',
        modalityId: newModality.id,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      class: expect.objectContaining({
        id: classEntity.id,
        name: 'Updated Class Name',
        description: 'Updated Class Description',
        userId: newInstructor.id,
        modalityId: newModality.id,
      }),
    });
  });
});
