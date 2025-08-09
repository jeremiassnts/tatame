import { describe, it, expect, beforeEach } from 'vitest';
import { FetchGraduationColorsUseCase } from './fetch-graduation-colors';
import { Modality, TypeOfGraduation } from '../entities/modality';
import { GraduationColor } from '../entities/graduation-color';
import { ModalityNotFoundError } from './error/modality-not-found.error';
import { InMemoryGraduationColorsRepository } from 'test/repositories/in-memory-graduation-colors.repository';
import { InMemoryModalitiesRepository } from 'test/repositories/in-memory-modalities.repository';

describe('Fetch Graduation Colors Use Case', () => {
  let sut: FetchGraduationColorsUseCase;
  let graduationColorsRepository: InMemoryGraduationColorsRepository;
  let modalitiesRepository: InMemoryModalitiesRepository;

  beforeEach(() => {
    graduationColorsRepository = new InMemoryGraduationColorsRepository();
    modalitiesRepository = new InMemoryModalitiesRepository();
    sut = new FetchGraduationColorsUseCase(
      graduationColorsRepository,
      modalitiesRepository,
    );
  });

  it('should fetch graduation colors by modality id', async () => {
    const modality = new Modality({
      name: 'Jiu-Jitsu',
      type: TypeOfGraduation.BELT,
    });

    await modalitiesRepository.create(modality);

    const color1 = new GraduationColor({
      name: 'Black',
      modalityId: modality.id,
      extraInfo: 'Black belt',
    });

    const color2 = new GraduationColor({
      name: 'Brown',
      modalityId: 'non-existent-id',
      extraInfo: 'Brown belt',
    });

    await graduationColorsRepository.create(color1);
    await graduationColorsRepository.create(color2);

    const { colors } = await sut.execute({
      modalityId: modality.id,
    });

    expect(colors).toHaveLength(1);
    expect(colors).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Black' })]),
    );
  });

  it('should throw ModalityNotFoundError when modality does not exist', async () => {
    await expect(() =>
      sut.execute({
        modalityId: 'non-existent-id',
      }),
    ).rejects.toThrow(ModalityNotFoundError);
  });
});
