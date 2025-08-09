import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../infra/app.module';
import { DatabaseModule } from '../../infra/repositories/database.module';
import { UserFactory } from 'test/factories/make-user';
import { PrismaService } from '../../infra/repositories/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptHasher } from '../../infra/services/bcrypt-hasher';
import { describe, expect, beforeAll, test } from 'vitest';

describe('Change password (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let prismaService: PrismaService;
  let jwt: JwtService;
  let hasher: BcryptHasher;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PrismaService, JwtService, BcryptHasher],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    prismaService = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    hasher = moduleRef.get(BcryptHasher);

    await app.init();
  });

  test('[POST] /users/change-password', async () => {
    //cria usuário
    const user = await userFactory.makePrismaUser({
      name: 'John Doe',
      email: 'john@email.com',
      password: '000000',
    });
    const accessToken = jwt.sign({ sub: user.id });

    const newPassword = '123456';
    const response = await request(app.getHttpServer())
      .post(`/users/change-password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: newPassword,
      });

    console.log(response.body);

    const userUpdated = await prismaService.user.findFirst({
      where: {
        id: user.id,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(
      await hasher.compare(
        newPassword,
        userUpdated ? userUpdated.password : '',
      ),
    ).toBeTruthy();
  });
});
