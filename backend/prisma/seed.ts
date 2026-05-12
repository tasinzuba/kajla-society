import "dotenv/config";
import { PrismaClient, Role, FacilityCategory } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Super admin
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@kajla.org" },
    update: {},
    create: {
      email: "admin@kajla.org",
      passwordHash,
      name: "Kajla Admin",
      role: Role.SUPER_ADMIN,
    },
  });
  console.log("✓ Super admin created:", admin.email);

  // Static pages
  const pages = [
    { slug: "home", title: "Home", content: "{}" },
    { slug: "about", title: "About Us", content: "{}" },
    { slug: "contact", title: "Contact", content: "{}" },
  ];
  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: { ...page, authorId: admin.id },
    });
  }
  console.log("✓ Default pages created");

  // Categories
  const categories = [
    { slug: "news", name: "News", nameBn: "সংবাদ" },
    { slug: "announcement", name: "Announcement", nameBn: "ঘোষণা" },
    { slug: "community", name: "Community", nameBn: "কমিউনিটি" },
  ];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✓ Categories created");

  // Site settings
  const settings = [
    { key: "site_name", value: "Kajla Society" },
    { key: "site_name_bn", value: "কাজলা সোসাইটি" },
    { key: "site_tagline", value: "A connected community" },
    { key: "office_address", value: "Kajla, Dhaka, Bangladesh" },
    { key: "office_phone", value: "+880 1XXX-XXXXXX" },
    { key: "office_email", value: "info@kajla.org" },
    { key: "office_hours", value: "9:00 AM - 5:00 PM" },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log("✓ Site settings created");

  // Sample facilities
  const facilities = [
    { category: FacilityCategory.RELIGIOUS, name: "Kajla Jame Mosque", order: 1 },
    { category: FacilityCategory.EDUCATIONAL, name: "Kajla High School", order: 1 },
    { category: FacilityCategory.HEALTH_EMERGENCY, name: "Community Health Center", order: 1 },
  ];
  for (const f of facilities) {
    await prisma.facility.create({ data: f });
  }
  console.log("✓ Sample facilities created");

  console.log("\n✅ Seed complete!");
  console.log("   Login: admin@kajla.org / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
