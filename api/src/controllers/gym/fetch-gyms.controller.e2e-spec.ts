import { describe, it, expect, beforeAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../infra/app.module';
import request from 'supertest';
import { DatabaseModule } from '../../infra/repositories/database.module';
import { GymFactory } from 'test/factories/make-gym';
import { UserFactory } from 'test/factories/make-user';

describe('Fetch Gyms (E2E)', () => {
  let app: INestApplication;
  let gymFactory: GymFactory;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [GymFactory, UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    gymFactory = moduleRef.get(GymFactory);
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  it('should fetch gyms', async () => {
    const manager = await userFactory.makePrismaUser();
    await gymFactory.makePrismaGym({
      name: 'Gym 1',
      managerId: manager.id,
    });

    const response = await request(app.getHttpServer()).get(`/gyms`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      gyms: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Gym 1',
        }),
      ]),
    });
  });
});
