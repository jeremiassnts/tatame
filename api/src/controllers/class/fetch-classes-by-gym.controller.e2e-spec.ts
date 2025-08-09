import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { DatabaseModule } from '../../database/database.module';
import { PrismaService } from '../../database/prisma/prisma.service';
import { describe, expect, beforeAll, test } from 'vitest';
import { JwtService } from '@nestjs/jwt';

describe('Fetch Classes by Gym (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /classes - should fetch classes for manager user', async () => {
    // Create a manager user
    const manager = await prismaService.user.create({
      data: {
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'hashedpassword',
        authorized: true,
        birth: new Date('1990-01-01'),
        gender: 'MALE',
      },
    });

    // Create user role
    await prismaService.userRole.create({
      data: {
        userId: manager.id,
        role: 'MANAGER',
      },
    });

    // Create gym managed by user
    const gym = await prismaService.gym.create({
      data: {
        name: 'Test Gym',
        address: '123 Main St',
        logo: 'logo.png',
        managerId: manager.id,
        since: new Date(),
      },
    });

    // Create modality
    const modality = await prismaService.modality.create({
      data: {
        name: 'Jiu-Jitsu',
        type: 'BELT',
      },
    });

    // Create classes for the gym
    await prismaService.class.create({
      data: {
        name: 'Morning Class',
        description: 'Morning training',
        timeStart: new Date('2024-01-15T08:00:00Z'),
        timeEnd: new Date('2024-01-15T09:30:00Z'),
        dayOfWeek: 'MONDAY',
        address: '123 Main St',
        active: true,
        gymId: gym.id,
        userId: manager.id,
        modalityId: modality.id,
      },
    });

    await prismaService.class.create({
      data: {
        name: 'Evening Class',
        description: 'Evening training',
        timeStart: new Date('2024-01-15T19:00:00Z'),
        timeEnd: new Date('2024-01-15T20:30:00Z'),
        dayOfWeek: 'TUESDAY',
        address: '123 Main St',
        active: true,
        gymId: gym.id,
        userId: manager.id,
        modalityId: modality.id,
      },
    });

    // Create JWT token for authentication
    const accessToken = jwtService.sign({ sub: manager.id });

    const response = await request(app.getHttpServer())
      .get('/classes')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.classes).toHaveLength(2);
    expect(response.body.classes[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        gymId: gym.id,
      }),
    );
  });
});
