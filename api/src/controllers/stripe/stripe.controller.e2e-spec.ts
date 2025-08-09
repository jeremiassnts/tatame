import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { DatabaseModule } from '../../database/database.module';
import { describe, it, expect, beforeAll } from 'vitest';

describe('Fetch stripe products (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  it('[GET] /stripe/products - should fetch all modalities', async () => {
    const response = await request(app.getHttpServer()).get('/stripe/products');

    expect(response.statusCode).toEqual(200);

    expect(response.body.products).not.toHaveLength(0);
  });
});
