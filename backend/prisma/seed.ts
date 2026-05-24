import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleTenants = [
  {
    name: 'Tech Store',
    slug: 'tech-store',
    email: 'admin@tech-store.local',
    primaryColor: '#4f46e5',
    secondaryColor: '#7c3aed',
    storeName: 'Tech Store',
    storeDescription: 'Best electronics deals',
  },
  {
    name: 'Fashion Hub',
    slug: 'fashion-hub',
    email: 'admin@fashion-hub.local',
    primaryColor: '#db2777',
    secondaryColor: '#9d174d',
    storeName: 'Fashion Hub',
    storeDescription: 'Trendy clothing and accessories',
  },
  {
    name: 'Home Goods',
    slug: 'home-goods',
    email: 'admin@home-goods.local',
    primaryColor: '#059669',
    secondaryColor: '#047857',
    storeName: 'Home & Living',
    storeDescription: 'Everything for your home',
  },
  {
    name: 'Sports World',
    slug: 'sports-world',
    email: 'admin@sports-world.local',
    primaryColor: '#d97706',
    secondaryColor: '#b45309',
    storeName: 'Sports World',
    storeDescription: 'Gear up for every sport',
  },
];

async function main() {
  for (const tenant of sampleTenants) {
    await prisma.tenant.upsert({
      where: { slug: tenant.slug },
      update: {
        name: tenant.name,
        email: tenant.email,
        primaryColor: tenant.primaryColor,
        secondaryColor: tenant.secondaryColor,
        storeName: tenant.storeName,
        storeDescription: tenant.storeDescription,
        isActive: true,
      },
      create: tenant,
    });
    console.log(`Seeded tenant: ${tenant.slug}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
