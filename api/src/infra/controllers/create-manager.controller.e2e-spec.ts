import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../repositories/database.module';
import { PrismaService } from '../repositories/prisma/prisma.service';
import { describe, it, expect, beforeAll } from 'vitest';

describe('Create Manager (E2E)', () => {
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

  it('[POST] /managers - should create a manager with gym and graduations', async () => {
    // Create modality and graduation color for the test
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
      isInstructor: true,
      gymName: "Jane's Gym",
      gymAddress: '123 Main St',
      gymLogo: 'logo.png',
      gymSince: new Date('2020-01-01').toISOString(),
      graduations: [
        {
          colorId: color.id,
          modalityId: modality.id,
          extraInfo: 'Black belt',
        },
      ],
      customerId: 'customer-1',
    };

    const response = await request(app.getHttpServer())
      .post('/managers')
      .send(body);

    const createdUser = await prismaService.user.findFirst();
    const createdGym = await prismaService.gym.findFirst();
    const createdGraduation = await prismaService.graduation.findFirst();

    expect(response.statusCode).toEqual(201);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Jane Doe',
        email: 'jane@example.com',
      }),
    );
    expect(response.body.gym).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "Jane's Gym",
        address: '123 Main St',
      }),
    );
    expect(createdUser?.email).toEqual('jane@example.com');
    expect(createdUser?.stripeCustomerId).toEqual('customer-1');
    expect(createdGym?.name).toEqual("Jane's Gym");
    expect(createdGraduation?.colorId).toEqual(color.id);
  });
});
