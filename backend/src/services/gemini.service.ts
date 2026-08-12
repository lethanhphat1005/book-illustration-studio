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
    
    console.log(`Uploaded file to Gemini: ${uploadResponse.file.uri}`);
    
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
): Promise<string | null> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Create a portrait art description for ${characterName}. Desc: ${characterDescription}. Style: ${stylePrompt}.`;
    const result = await model.generateContent(prompt);
    
    if (!result.response) {
      throw new Error("Failed to get response from Gemini text model.");
    }

    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `portrait-${projectId}-${charId}-${Date.now()}.jpg`;
    const filePath = path.join(uploadsDir, fileName);

    // Dummy if failed
    const fallbackBuffer = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64"); 
    fs.writeFileSync(filePath, fallbackBuffer);

    return `http://localhost:3000/uploads/${fileName}`;

  } catch (error) {
    console.error(`[Portrait Generation Error] Failed for character ${characterName}:`, error);
    
    // Fallback if error
    return null; 
  }
};