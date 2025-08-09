import { faker } from '@faker-js/faker';
import { Graduation } from '../../src/entities/graduation';

export function makeGraduation(override: Partial<Graduation> = {}) {
  const graduation = new Graduation({
    colorId: faker.string.uuid(),
    userId: faker.string.uuid(),
    modalityId: faker.string.uuid(),
    ...override,
  });

  return graduation;
}
