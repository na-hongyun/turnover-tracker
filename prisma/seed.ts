import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createMockProducts } from "../src/infrastructure/data/mockProductFactory";

const prisma = new PrismaClient();

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234qwer";

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { username: ADMIN_USERNAME },
    update: { passwordHash },
    create: {
      username: ADMIN_USERNAME,
      passwordHash,
    },
  });
  console.log(`Seeded user: ${ADMIN_USERNAME}`);

  const mockProducts = createMockProducts();
  for (const product of mockProducts) {
    await prisma.product.upsert({
      where: { barcode: product.barcode },
      update: {
        name: product.name,
        currentStock: product.currentStock,
        shipmentM1: product.shipmentM1,
        shipmentM2: product.shipmentM2,
        shipmentM3: product.shipmentM3,
        seasonalityIndex: product.seasonalityIndex,
        leadTime: product.leadTime,
        unitPrice: product.unitPrice,
      },
      create: {
        id: product.id,
        barcode: product.barcode,
        name: product.name,
        currentStock: product.currentStock,
        shipmentM1: product.shipmentM1,
        shipmentM2: product.shipmentM2,
        shipmentM3: product.shipmentM3,
        seasonalityIndex: product.seasonalityIndex,
        leadTime: product.leadTime,
        unitPrice: product.unitPrice,
      },
    });
  }

  console.log(`Seeded ${mockProducts.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
