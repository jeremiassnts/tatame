import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../repositories/database.module';
import { PrismaService } from '../repositories/prisma/prisma.service';
import { describe, expect, beforeAll, test } from 'vitest';
import { JwtService } from '@nestjs/jwt';

describe('Fetch Class by Id (E2E)', () => {
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

  test('[GET] /classes/:id - should fetch class by id', async () => {
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
    // Create class
    const classEntity = await prismaService.class.create({
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
    // Create JWT token for authentication
    const accessToken = jwtService.sign({ sub: manager.id });
    const response = await request(app.getHttpServer())
      .get(`/classes/${classEntity.id}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.class).not.toBeNull();
    expect(response.body.class.id).toEqual(classEntity.id);
  });
});
