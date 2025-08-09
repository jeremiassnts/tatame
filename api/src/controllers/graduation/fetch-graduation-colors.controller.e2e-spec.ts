import { describe, it, expect, beforeAll } from 'vitest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../database/prisma/prisma.service';
import request from 'supertest';
import { DatabaseModule } from '../../database/database.module';

describe('Fetch Graduation Colors (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get(PrismaService);

    await app.init();
  });

  it('should fetch graduation colors by modality id', async () => {
    const modality1 = await prismaService.modality.create({
      data: { name: 'Jiu-Jitsu', type: 'BELT' },
    });
    await prismaService.graduationColor.createMany({
      data: { name: 'Black', modalityId: modality1.id },
    });
    const modality2 = await prismaService.modality.create({
      data: { name: 'Jiu-Jitsu', type: 'BELT' },
    });
    await prismaService.graduationColor.createMany({
      data: { name: 'Brown', modalityId: modality2.id },
    });

    const response = await request(app.getHttpServer()).get(
      `/modalities/${modality1.id}/colors`,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      colors: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: 'Black',
          modalityId: modality1.id,
        }),
      ]),
    });
  });
});
