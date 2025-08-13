import { PrismaClient, Role, OrgType, ProjectStatus, ListingType, Currency, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@flatworthy.com';
  const password = 'admin';
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      name: 'Admin',
    },
  });

  let devOrg = await prisma.org.findFirst({ where: { slug: 'demo-developer' } });
  if (!devOrg) {
    devOrg = await prisma.org.create({
      data: {
        type: OrgType.DEVELOPER,
        name: 'Demo Developer',
        slug: 'demo-developer',
        city: 'Kyiv',
        country: 'Ukraine',
      },
    });
  }

  let complexOrg = await prisma.org.findFirst({ where: { slug: 'demo-complex' } });
  if (!complexOrg) {
    complexOrg = await prisma.org.create({
      data: {
        type: OrgType.COMPLEX,
        name: 'Demo Complex Operator',
        slug: 'demo-complex',
        city: 'Kyiv',
        country: 'Ukraine',
      },
    });
  }

  let devProject = await prisma.project.findFirst({ where: { slug: 'sunny-hills' } });
  if (!devProject) {
    devProject = await prisma.project.create({
      data: {
        name: 'Sunny Hills',
        slug: 'sunny-hills',
        orgId: devOrg.id,
        city: 'Kyiv',
        status: ProjectStatus.UNDER_CONSTRUCTION,
      },
    });
  }

  let complexProject = await prisma.project.findFirst({ where: { slug: 'river-view' } });
  if (!complexProject) {
    complexProject = await prisma.project.create({
      data: {
        name: 'River View',
        slug: 'river-view',
        orgId: complexOrg.id,
        city: 'Kyiv',
        status: ProjectStatus.PLANNED,
      },
    });
  }

  const saleUnit = await prisma.unit.upsert({
    where: { id: 'seed-sale-1' },
    update: {},
    create: {
      id: 'seed-sale-1',
      projectId: devProject.id,
      title: '1BR Apartment',
      listingType: ListingType.SALE,
      bedrooms: 1,
      bathrooms: 1,
      areaSqm: 45,
      price: new Prisma.Decimal(75000),
      currency: Currency.USD,
    },
  });

  const rentUnit = await prisma.unit.upsert({
    where: { id: 'seed-rent-1' },
    update: {},
    create: {
      id: 'seed-rent-1',
      projectId: complexProject.id,
      title: 'Studio',
      listingType: ListingType.RENT,
      bedrooms: 0,
      bathrooms: 1,
      areaSqm: 30,
      price: new Prisma.Decimal(650),
      currency: Currency.USD,
    },
  });

  console.log('Seed completed:', { admin: admin.email, devOrg: devOrg.slug, complexOrg: complexOrg.slug, saleUnit: saleUnit.id, rentUnit: rentUnit.id });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});