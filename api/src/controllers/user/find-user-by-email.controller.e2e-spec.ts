import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../infra/app.module';
import { UserFactory } from 'test/factories/make-user';
import { beforeAll, describe, expect, test } from 'vitest';
import { DatabaseModule } from '../../infra/repositories/database.module';

describe('Find User By Email (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test('[GET] /users/check-email', async () => {
    const user = await userFactory.makePrismaUser();

    const response = await request(app.getHttpServer())
      .get('/users/check-email')
      .query({
        email: user.email,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      userId: user.id,
    });
  });
});
