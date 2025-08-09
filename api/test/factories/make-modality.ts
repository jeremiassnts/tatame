import { faker } from '@faker-js/faker';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Modality, TypeOfGraduation } from 'src/entities/modality';

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
