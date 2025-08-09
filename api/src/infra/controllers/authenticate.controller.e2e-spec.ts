import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../repositories/database.module';
import { describe, beforeAll, expect, it } from 'vitest';
import { UserFactory } from 'test/factories/make-user';
import { hash } from 'bcryptjs';

describe('Authenticate (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get<UserFactory>(UserFactory);

    await app.init();
  });

  it('should be able to POST /sessions with valid email and password', async () => {
    const user = await userFactory.makePrismaUser({
      password: await hash('123456', 8),
    });
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: user.email,
      password: '123456',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      accessToken: expect.any(String),
      expiresIn: expect.any(String),
    });
  });
});
