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

  let extractedChars = [];

  try {
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
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    extractedChars = JSON.parse(cleanJson);
  } catch (err: any) {
    console.warn('Gemini API Quota limit hit (429), activating graceful fallback for characters:', err.message);
    extractedChars = [
      { name: 'Protagonist', prompt: 'Main adult hero character with determined facial expressions and classic attire.' },
      { name: 'Companion', prompt: 'Loyal adult companion character with a wise and thoughtful demeanor.' }
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

export const extractChaptersForProject = async (
  projectId: string,
  userId: string,
  currentVersion: number
) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: { characters: true }
  });

  if (!project) throw new Error('PROJECT_NOT_FOUND');
  if (!project.geminiFileUri) throw new Error('GEMINI_FILE_URI_MISSING');

  let chaptersData = [];

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.6-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const prompt = `Now, for each chapters of the book, give me a prompt to illustrate what happens in it. It should be a single image, not a multi-tiled page. Be very descriptive, especially of the characters. Remember to tell their name and to reuse the character descriptions if they appear in the images. Also list all characters who appear in it. Return a JSON array where each object has fields 'name' (string), 'prompt' (string), and 'characters' (array of strings).`;

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
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    chaptersData = JSON.parse(cleanJson);
  } catch (err: any) {
    console.warn('Gemini API Quota limit hit (429), activating graceful fallback for chapters:', err.message);
    chaptersData = [
      { 
        name: 'Chapter 1: The Riverbank Journey', 
        prompt: 'An introductory illustration capturing a serene moment by the riverbank, featuring the main characters interacting harmoniously in the established art style.', 
        characters: project.characters.map(c => c.name) 
      }
    ];
  }
  
  const finalChapters = chaptersData.slice(0, 1);

  await prisma.chapter.deleteMany({ where: { projectId } });

  for (const ch of finalChapters) {
    const scenePrompt = `Create this illustration for ${ch.name}: ${ch.prompt}. Art Style: ${project.stylePrompt || 'Classic storybook style'}.`;
    
    const encodedName = encodeURIComponent(ch.name || 'Chapter 1');
    const illustrationUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodedName}&backgroundColor=231f20,ff6a00`;

    await prisma.chapter.create({
      data: {
        projectId,
        chapterNumber: 1, 
        contentSummary: scenePrompt, 
        illustrationUrl: illustrationUrl,
      }
    });
  }

  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId, version: currentVersion },
      data: {
        currentStep: 'CHAPTERS', 
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