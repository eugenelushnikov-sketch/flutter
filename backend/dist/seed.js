"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminEmail = 'admin@flatworthy.com';
    const password = 'admin';
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            passwordHash,
            role: client_1.Role.ADMIN,
            name: 'Admin',
        },
    });
    let devOrg = await prisma.org.findFirst({ where: { slug: 'demo-developer' } });
    if (!devOrg) {
        devOrg = await prisma.org.create({
            data: {
                type: client_1.OrgType.DEVELOPER,
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
                type: client_1.OrgType.COMPLEX,
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
                status: client_1.ProjectStatus.UNDER_CONSTRUCTION,
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
                status: client_1.ProjectStatus.PLANNED,
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
            listingType: client_1.ListingType.SALE,
            bedrooms: 1,
            bathrooms: 1,
            areaSqm: 45,
            price: new client_1.Prisma.Decimal(75000),
            currency: client_1.Currency.USD,
        },
    });
    const rentUnit = await prisma.unit.upsert({
        where: { id: 'seed-rent-1' },
        update: {},
        create: {
            id: 'seed-rent-1',
            projectId: complexProject.id,
            title: 'Studio',
            listingType: client_1.ListingType.RENT,
            bedrooms: 0,
            bathrooms: 1,
            areaSqm: 30,
            price: new client_1.Prisma.Decimal(650),
            currency: client_1.Currency.USD,
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
//# sourceMappingURL=seed.js.map