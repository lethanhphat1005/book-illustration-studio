import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { loadEnvFile } from 'node:process';

try {
  loadEnvFile();
} catch (err) {
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Cannot find file .env! Please import and try again!!");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const loginOrCreateUser = async (email: string, fullName: string) => {
  const user = await prisma.user.upsert({
    where: { email },
    update: { fullName },
    create: { email, fullName },
  });

  return user;
};