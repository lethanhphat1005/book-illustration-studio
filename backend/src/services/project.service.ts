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

export const getProjectById = async (projectId: string, userId: string) => {
  return await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: {
      characters: true,
      chapters: true,
    }
  });
};

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


export const advanceProjectStyle = async (
  projectId: string, 
  currentVersion: number, 
  stylePrompt: string
) => {
  try {
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
        version: currentVersion, 
      },
      data: {
        stylePrompt,
        currentStep: 'STYLE', 
        status: 'IDLE',
        version: { increment: 1 }, 
      },
    });

    return updatedProject;
  } catch (error) {
    throw new Error('OCC_CONFLICT');
  }
};