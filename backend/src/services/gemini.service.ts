import { GoogleAIFileManager } from '@google/generative-ai/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY || '');

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