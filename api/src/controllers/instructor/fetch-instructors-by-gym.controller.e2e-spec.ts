import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserFactory } from 'test/factories/make-user';
import { AppModule } from '../../app.module';
import { describe, test, expect, beforeAll } from 'vitest';
import { DatabaseModule } from '../../database/database.module';
import { GymFactory } from 'test/factories/make-gym';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Role } from 'src/entities/user-role';

describe('Fetch Instructors By Gym (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let userFactory: UserFactory;
  let gymFactory: GymFactory;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, JwtService, GymFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    userFactory = moduleRef.get(UserFactory);
    gymFactory = moduleRef.get(GymFactory);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[GET] /gyms/:gymId/instructors', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({ sub: user.id });

    await gymFactory.makePrismaGym({
      id: 'gym-1',
      managerId: user.id,
    });

    await prisma.userRole.create({
      data: {
        userId: user.id,
        role: Role.INSTRUCTOR,
      },
    });

    const response = await request(app.getHttpServer())
      .get('/gyms/gym-1/instructors')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.instructors).toHaveLength(1);
    expect(response.body).toEqual({
      instructors: expect.arrayContaining([
        expect.objectContaining({ id: user.id }),
      ]),
    });
  });
});
