import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ادمین پیش‌فرض
  const adminPass = await bcrypt.hash("Admin@1234", 12);
  const admin = await db.user.upsert({
    where: { email: "admin@legalfirm.ir" },
    update: {},
    create: {
      name: "مدیر سیستم",
      email: "admin@legalfirm.ir",
      phone: "09100000000",
      password: adminPass,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin created:", admin.email);

  // دسته‌بندی مقالات
  const categories = [
    { nameFA: "حقوق مدنی", nameEN: "Civil Law", slug: "civil-law" },
    { nameFA: "حقوق کیفری", nameEN: "Criminal Law", slug: "criminal-law" },
    { nameFA: "حقوق تجاری", nameEN: "Commercial Law", slug: "commercial-law" },
    { nameFA: "حقوق خانواده", nameEN: "Family Law", slug: "family-law" },
    { nameFA: "امور ملکی", nameEN: "Property Law", slug: "property-law" },
  ];

  for (const cat of categories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categories seeded");

  // وکیل نمونه
  const lawyerPass = await bcrypt.hash("Lawyer@1234", 12);
  const lawyerUser = await db.user.upsert({
    where: { email: "lawyer@legalfirm.ir" },
    update: {},
    create: {
      name: "دکتر علی محمدی",
      email: "lawyer@legalfirm.ir",
      phone: "09111111111",
      password: lawyerPass,
      role: "LAWYER",
    },
  });

  await db.lawyer.upsert({
    where: { userId: lawyerUser.id },
    update: {},
    create: {
      userId: lawyerUser.id,
      barNumber: "IR-12345",
      status: "APPROVED",
      specialtiesFA: JSON.stringify(["حقوق مدنی", "حقوق تجاری"]),
      specialtiesEN: JSON.stringify(["Civil Law", "Commercial Law"]),
      bioFA: "دکتر محمدی با بیش از ۲۲ سال تجربه در زمینه حقوق مدنی و تجاری فعالیت می‌کند.",
      bioEN: "Dr. Mohammadi has over 22 years of experience in civil and commercial law.",
      experience: 22,
      consultFee: 500000,
      isAvailable: true,
    },
  });
  console.log("✅ Sample lawyer seeded:", lawyerUser.email);

  // موکل نمونه
  const clientPass = await bcrypt.hash("Client@1234", 12);
  await db.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      name: "محمد رضایی",
      email: "client@example.com",
      phone: "09122222222",
      password: clientPass,
      role: "CLIENT",
    },
  });
  console.log("✅ Sample client seeded");

  console.log("\n📋 Login credentials:");
  console.log("  Admin:  admin@legalfirm.ir  /  Admin@1234");
  console.log("  Lawyer: lawyer@legalfirm.ir /  Lawyer@1234");
  console.log("  Client: client@example.com  /  Client@1234");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
