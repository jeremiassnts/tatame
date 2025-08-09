import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../repositories/database.module';
import { UserFactory } from 'test/factories/make-user';
import { describe, expect, beforeAll, test } from 'vitest';

describe.skip('Request change password (E2E)', () => {
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

  test('[POST] /users/request-change-password', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'jeremiassnts3@gmail.com',
    });
    const response = await request(app.getHttpServer())
      .post(`/users/request-change-password`)
      .send({
        email: user.email,
      });
    console.log(response.body);

    expect(response.status).toBe(204);
  });
});
