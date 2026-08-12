import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { loadEnvFile } from 'node:process';
import { generateCharacterPortraitImage } from './gemini.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

try {
  loadEnvFile();
} catch (err) {}

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
    const formattedStyle = stylePrompt && stylePrompt.trim().length > 0
      ? stylePrompt.trim()
      : 'Warm, hand-painted storybook style with rich atmospheric lighting.';

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
        version: currentVersion, 
      },
      data: {
        stylePrompt: formattedStyle,
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

export const extractCharactersForProject = async (
  projectId: string,
  userId: string,
  currentVersion: number
) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) throw new Error('PROJECT_NOT_FOUND');
  if (!project.geminiFileUri) throw new Error('GEMINI_FILE_URI_MISSING');

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-3.6-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    }
  });

  const prompt = "Can you describe the main characters (only the adults) and prepare a prompt describing them with as much details as possible. Return a JSON array where each object has fields 'name' and 'prompt'.";

  const result = await model.generateContent([
    {
      fileData: {
        fileUri: project.geminiFileUri,
        mimeType: project.geminiFileMimeType || 'text/plain',
      },
    },
    prompt,
  ]);

  const responseText = result.response.text() || '[]';
  let extractedChars = [];
  try {
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    extractedChars = JSON.parse(cleanJson);
  } catch (e) {
    extractedChars = [
      { name: 'Protagonist', prompt: 'Main adult character of the story.' }
    ];
  }

  const finalChars = extractedChars.slice(0, 2);

  await prisma.character.deleteMany({ where: { projectId } });

  for (const char of finalChars) {
    await prisma.character.create({
      data: {
        projectId,
        name: char.name || 'Character',
        description: char.prompt || char.description || 'Main character description',
        isAdult: true,
      }
    });
  }

  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId, version: currentVersion },
      data: {
        currentStep: 'CHARACTERS',
        status: 'IDLE',
        version: { increment: 1 },
      },
      include: { characters: true, chapters: true },
    });

    return updatedProject;
  } catch (err) {
    throw new Error('OCC_CONFLICT');
  }
};

export const generatePortraitsForProject = async (
  projectId: string,
  userId: string,
  currentVersion: number
) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: { characters: true }
  });

  if (!project) throw new Error('PROJECT_NOT_FOUND');
  if (project.characters.length === 0) throw new Error('NO_CHARACTERS_FOUND');
  
  // Đảm bảo tuân thủ hard requirement: Tối đa 2 nhân vật
  const targetCharacters = project.characters.slice(0, 2);

  for (const char of targetCharacters) {
    const result = await generateCharacterPortraitImage(
      char.name,
      char.description,
      project.stylePrompt || 'Classic storybook style',
      projectId,
      char.id
    );

    await prisma.character.update({
      where: { id: char.id },
      data: { portraitUrl: result.imageUrl }
    });
  }

  try {
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
        version: currentVersion,
      },
      data: {
        currentStep: 'PORTRAITS',
        status: 'IDLE',
        version: { increment: 1 },
      },
      include: { characters: true, chapters: true }
    });

    return updatedProject;
  } catch (err) {
    throw new Error('OCC_CONFLICT');
  }
};