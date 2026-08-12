import { Request, Response } from 'express';
import { getProjectsByUserId, createProjectRecord } from '../services/project.service';
import { uploadBookTextToGemini } from '../services/gemini.service'; 

export const getUserProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User ID is missing in request headers.' });
      return;
    }

    const projects = await getProjectsByUserId(userId);

    res.status(200).json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to retrieve projects. Please try again later.' });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, bookText } = req.body;
    const userId = req.headers['x-user-id'] as string;

    // 1. Validation
    if (!title || !bookText || !userId) {
      res.status(400).json({ error: 'Missing required fields: title, bookText, or x-user-id header.' });
      return;
    }

    // 2. Upload text to Gemini
    const fileInfo = await uploadBookTextToGemini(bookText, title);

    // 3. Save to Database using Service
    const project = await createProjectRecord(title, userId, fileInfo);

    // 4. Return success
    res.status(201).json({ project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project.' });
  }
};