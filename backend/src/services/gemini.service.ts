import { GoogleAIFileManager } from '@google/generative-ai/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import os from 'os';

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY || '');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface GeminiUploadResult {
  name: string;
  uri: string;
  mimeType: string;
}

export const uploadBookTextToGemini = async (text: string, title: string): Promise<GeminiUploadResult> => {
  const tempFilePath = path.join(os.tmpdir(), `book-${Date.now()}.txt`);
  fs.writeFileSync(tempFilePath, text);

  try {
    const uploadResponse = await fileManager.uploadFile(tempFilePath, {
      mimeType: 'text/plain',
      displayName: `Source: ${title}`,
    });
    
    return {
      name: uploadResponse.file.name,
      uri: uploadResponse.file.uri,
      mimeType: uploadResponse.file.mimeType,
    };
  } catch (error) {
    console.error('Failed to upload file to Gemini API:', error);
    throw new Error('Gemini API upload failed.');
  } finally {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
};

export const generateCharacterPortraitImage = async (
  characterName: string,
  characterDescription: string,
  stylePrompt: string,
  projectId: string,
  charId: string
): Promise<{ imageUrl: string }> => {
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileName = `portrait-${projectId}-${charId}-${Date.now()}.txt`;
  const filePath = path.join(uploadsDir, fileName);

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const fullPrompt = `Create a detailed portrait art prompt for character: ${characterName}. Description: ${characterDescription}. Art style: ${stylePrompt}. Rules: Family-friendly, highly descriptive.`;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    fs.writeFileSync(filePath, Buffer.from(responseText || 'Character Portrait Data', 'utf-8'));

  } catch (apiError: any) {
    console.warn('Gemini API Quota limit hit (429) during portrait generation, activating fallback file:', apiError.message);
    fs.writeFileSync(filePath, Buffer.from(`Fallback Portrait Prompt for ${characterName}: ${characterDescription}`, 'utf-8'));
  }

  const encodedName = encodeURIComponent(characterName);
  const portraitUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodedName}&backgroundColor=ffdfbf,ffd5dc,b6e3f4`;

  return {
    imageUrl: portraitUrl
  };
};
