import { beforeAll, describe, expect, test } from 'vitest';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { DatabaseModule } from '../../database/database.module';

describe('Upload gym logo photo (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  test('[POST] /attachments/:gymId/gym', async () => {
    const gymId = 'gym-id-123';

    const response = await request(app.getHttpServer())
      .post(`/attachments/${gymId}/gym`)
      .attach('file', './test/e2e/default.png');

    expect(response.statusCode).toBe(201);
  });

  test('[POST] /attachments/:gymId/gym - should return 400 when gymId is missing', async () => {
    const response = await request(app.getHttpServer())
      .post('/attachments//gym')
      .attach('file', './test/e2e/default.png');

    expect(response.statusCode).toBe(404);
  });

  test('[POST] /attachments/:gymId/gym - should return 400 when file is not provided', async () => {
    const gymId = 'gym-id-123';

    const response = await request(app.getHttpServer()).post(
      `/attachments/${gymId}/gym`,
    );

    expect(response.statusCode).toBe(400);
  });

  test('[POST] /attachments/:gymId/gym - should return 400 when file type is invalid', async () => {
    const gymId = 'gym-id-123';

    const response = await request(app.getHttpServer())
      .post(`/attachments/${gymId}/gym`)
      .attach('file', './package.json'); // Invalid file type

    expect(response.statusCode).toBe(400);
  });
});
