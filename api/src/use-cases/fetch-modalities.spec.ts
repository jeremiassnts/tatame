import { describe, it, expect, beforeEach } from 'vitest';
import { FetchModalitiesUseCase } from './fetch-modalities';
import { Modality, TypeOfGraduation } from '../entities/modality';
import { InMemoryModalitiesRepository } from 'test/repositories/in-memory-modalities.repository';

describe('Fetch all modalitites', () => {
  let sut: FetchModalitiesUseCase;
  let modalitiesRepository: InMemoryModalitiesRepository;

  beforeEach(() => {
    modalitiesRepository = new InMemoryModalitiesRepository();
    sut = new FetchModalitiesUseCase(modalitiesRepository);
  });

  it('should fetch all modalitites successfully', async () => {
    const modality = new Modality({
      name: 'Jiu Jitsu',
      type: TypeOfGraduation.BELT,
    });
    modalitiesRepository.items.push(modality);
    const result = await sut.execute();

    expect(result.modalities).toHaveLength(1);
  });
});
