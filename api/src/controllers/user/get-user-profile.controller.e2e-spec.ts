import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { DatabaseModule } from 'src/database/database.module';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { makeUser } from 'test/factories/make-user';
import { makeGym } from 'test/factories/make-gym';
import { makeGraduation } from 'test/factories/make-graduation';
import { PrismaUserMapper } from 'src/database/prisma/mappers/prisma-user.mapper';
import { PrismaGymMapper } from 'src/database/prisma/mappers/prisma-gym.mapper';
import { PrismaGraduationMapper } from 'src/database/prisma/mappers/prisma-graduation.mapper';
import { PrismaUserRoleMapper } from 'src/database/prisma/mappers/prisma-user-role.mapper';
import { Role, UserRole } from 'src/entities/user-role';
import { beforeAll, describe, expect, test } from 'vitest';

describe('Get User Profile (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /users/profile - should return user profile', async () => {
    const user = makeUser();
    const gym = makeGym({ managerId: user.id });
    const userRole = new UserRole({ userId: user.id, role: Role.MANAGER });

    // Create modality and graduation color first
    const modality = await prisma.modality.create({
      data: { name: 'Jiu-Jitsu', type: 'BELT' },
    });

    const graduationColor = await prisma.graduationColor.create({
      data: { name: 'Black', modalityId: modality.id },
    });

    const graduation = makeGraduation({
      userId: user.id,
      colorId: graduationColor.id,
    });

    await prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    await prisma.gym.create({
      data: PrismaGymMapper.toPrisma(gym),
    });

    await prisma.graduation.create({
      data: PrismaGraduationMapper.toPrisma(graduation),
    });

    await prisma.userRole.create({
      data: PrismaUserRoleMapper.toPrisma(userRole),
    });

    const accessToken = jwt.sign({ sub: user.id });

    const response = await request(app.getHttpServer())
      .get('/users/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.userProfile).toEqual({
      user: expect.objectContaining({
        id: user.id,
        name: user.name,
        email: user.email,
      }),
      gym: expect.objectContaining({
        id: gym.id,
        name: gym.name,
        address: gym.address,
      }),
      graduations: expect.arrayContaining([
        expect.objectContaining({
          id: graduation.id,
          userId: user.id,
        }),
      ]),
      roles: expect.arrayContaining([
        expect.objectContaining({
          role: Role.MANAGER,
        }),
      ]),
    });
  });
});
