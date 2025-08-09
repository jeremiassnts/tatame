import { randomUUID } from 'crypto';
import { PrismaService } from './prisma.service';

async function seed() {
  const prisma = new PrismaService();
  await prisma.trainingGym.deleteMany();
  await prisma.graduation.deleteMany();
  await prisma.graduationColor.deleteMany();
  await prisma.modality.deleteMany();
  await prisma.gym.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();

  //modalities
  const jjModality = await prisma.modality.create({
    data: {
      id: randomUUID(),
      name: 'Jiu-Jitsu',
      type: 'BELT',
    },
  });
  //graduation colors
  await prisma.graduationColor.createMany({
    data: [
      {
        id: randomUUID(),
        name: 'Branca',
        modalityId: jjModality.id,
      },
      {
        id: randomUUID(),
        name: 'Azul',
        modalityId: jjModality.id,
      },
      {
        id: randomUUID(),
        name: 'Roxa',
        modalityId: jjModality.id,
      },
      {
        id: randomUUID(),
        name: 'Marrom',
        modalityId: jjModality.id,
      },
      {
        id: randomUUID(),
        name: 'Preta',
        modalityId: jjModality.id,
      },
    ],
  });
}

seed();
