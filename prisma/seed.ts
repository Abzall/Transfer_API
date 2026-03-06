import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Очистка таблиц
  await prisma.enrollment.deleteMany();
  await prisma.appealChild.deleteMany();
  await prisma.appeal.deleteMany();
  await prisma.athleteProfile.deleteMany();
  await prisma.sportsCenterProgram.deleteMany();

  // Создаём программы
  const currentProgram = await prisma.sportsCenterProgram.create({
    data: {
      sportsCenterId: 'provider-1',
      sportType: 'Футбол',
      capacity: 5,
    },
  });

  await prisma.sportsCenterProgram.create({
    data: {
      sportsCenterId: 'provider-2',
      sportType: 'Баскетбол',
      capacity: 5,
    },
  });

  // Атлеты
  const athlete1 = await prisma.athleteProfile.create({
    data: { iin: '123456789012' },
  });

  const athlete2 = await prisma.athleteProfile.create({
    data: { iin: '987654321098' },
  });

  // Approved enrollment у текущего центра
  await prisma.enrollment.createMany({
    data: [
      {
        athleteProfileId: athlete1.id,
        sportsCenterId: 'provider-1',
        programId: currentProgram.id,
        status: 'APPROVED',
      },
      {
        athleteProfileId: athlete2.id,
        sportsCenterId: 'provider-1',
        programId: currentProgram.id,
        status: 'APPROVED',
      },
    ],
  });

  // Appeal
  const appeal = await prisma.appeal.create({
    data: {
      id: 'test-appeal-1',
      category: 'CHANGE_PROVIDER',
      status: 'OPEN',
      message: `
Email ваучера: parent@example.com
ID текущего поставщика: provider-1
ID желаемого поставщика: provider-2
Текущий вид спорта: Футбол
Желаемый вид спорта: Баскетбол
      `,
      children: {
        create: [
          {
            childIin: '123456789012',
            childName: 'Жанна',
          },
          {
            childIin: '987654321098',
            childName: 'Алекс',
          },
        ],
      },
    },
  });

  console.log('Appeal ID:', appeal.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
