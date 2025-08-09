import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../repositories/database.module';
import { PrismaService } from '../repositories/prisma/prisma.service';
import { describe, it, expect, beforeAll } from 'vitest';

describe('Create User (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get(PrismaService);

    await app.init();
  });

  it('[POST] /Users - should create a User with graduations', async () => {
    const modality = await prismaService.modality.create({
      data: { name: 'Jiu-Jitsu', type: 'BELT' },
    });
    const color = await prismaService.graduationColor.create({
      data: { name: 'Black', modalityId: modality.id },
    });

    const body = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      gender: 'FEMALE',
      birth: new Date('1990-01-01').toISOString(),
      role: 'STUDENT',
      graduations: [
        {
          colorId: color.id,
          modalityId: modality.id,
          extraInfo: 'Black belt',
        },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(body);

    const createdUser = await prismaService.user.findFirst();
    const createdGraduation = await prismaService.graduation.findFirst();

    expect(response.statusCode).toEqual(201);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Jane Doe',
        email: 'jane@example.com',
      }),
    );
    expect(createdUser?.email).toEqual('jane@example.com');
    expect(createdGraduation?.colorId).toEqual(color.id);
  });
});
