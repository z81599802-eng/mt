import { prisma } from '../src/prisma/client.js';

async function main() {
  await prisma.category.upsert({
    where: { id: 'seed-cat' },
    update: {},
    create: { id: 'seed-cat', name: 'Groceries' },
  });
  const category = await prisma.category.findFirst({ where: { name: 'Groceries' } });
  if (!category) return;
  await prisma.product.upsert({
    where: { id: 'seed-prod' },
    update: {},
    create: {
      id: 'seed-prod',
      name: 'Rice 1kg',
      priceInPaisa: 12000,
      unitType: 'kg',
      categoryId: category.id,
    },
  });
}

main().finally(async () => prisma.$disconnect());
