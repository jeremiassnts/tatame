import { faker } from '@faker-js/faker';
import { PrismaService } from 'src/infra/repositories/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Modality, TypeOfGraduation } from 'src/domain/entities/modality';

@Injectable()
export class ModalityFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaModality(override: Partial<Modality> = {}) {
    const modality = makeModality(override);
    return await this.prisma.modality.create({
      data: {
        name: modality.name,
        type: modality.type,
        ...override,
      },
    });
  }
}

export function makeModality(override: Partial<Modality> = {}) {
  const modality = new Modality({
    name: faker.word.sample(5),
    type: TypeOfGraduation.BELT,
    ...override,
  });

  return modality;
}
