import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { loadEnvFile } from 'node:process';

try {
  loadEnvFile();
} catch (err) {
}

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const getProjectsByUserId = async (userId: string) => {
  return await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      currentStep: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

interface GeminiFileInfo {
  name: string;
  uri: string;
  mimeType: string;
}

export const createProjectRecord = async (
  title: string, 
  userId: string, 
  fileInfo: GeminiFileInfo
) => {
  return await prisma.project.create({
    data: {
      title,
      userId,
      geminiFileName: fileInfo.name,           
      geminiFileUri: fileInfo.uri,             
      geminiFileMimeType: fileInfo.mimeType,   
      currentStep: 'INIT',                     
      status: 'IDLE',                          
      version: 0,                              
    }
  });
};