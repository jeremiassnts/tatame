import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../repositories/database.module';
import { describe, it, expect, beforeAll } from 'vitest';
import { ModalityFactory } from 'test/factories/make-modality';

describe('Fetch modalities (E2E)', () => {
  let app: INestApplication;
  let modalityFactory: ModalityFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ModalityFactory],
    }).compile();

    modalityFactory = moduleRef.get(ModalityFactory);
    app = moduleRef.createNestApplication();

    await app.init();
  });

  it('[POST] /modalities - should fetch all modalities', async () => {
    await modalityFactory.makePrismaModality();

    const response = await request(app.getHttpServer()).get('/modalities');

    expect(response.statusCode).toEqual(200);
    expect(response.body.modalities).toHaveLength(1);
    expect(response.body.modalities[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        type: expect.any(String),
      }),
    );
  });
});
