import { Request, Response } from 'express';
import { getProjectsByUserId, createProjectRecord, getProjectById, advanceProjectStyle } from '../services/project.service';
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

export const getProjectDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const projectId = Array.isArray(rawId) ? rawId[0] : rawId;
    
    const userId = req.headers['x-user-id'] as string;

    if (!userId || !projectId) {
      res.status(401).json({ error: 'Unauthorized or missing project ID' });
      return;
    }

    const project = await getProjectById(projectId, userId);

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ error: 'Failed to retrieve project details.' });
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

export const advanceProjectStep = async (req: Request, res: Response): Promise<void> => {
  try {
    // Xử lý an toàn tương tự cho id ở route advance
    const rawId = req.params.id;
    const projectId = Array.isArray(rawId) ? rawId[0] : rawId;

    const { version, payload } = req.body; // payload chứa stylePrompt
    const userId = req.headers['x-user-id'] as string;

    if (!userId || !projectId) {
      res.status(401).json({ error: 'Unauthorized: Missing user ID or project ID.' });
      return;
    }

    const { stylePrompt } = payload || {};

    if (!stylePrompt) {
      res.status(400).json({ error: 'Style prompt is required.' });
      return;
    }

    const updatedProject = await advanceProjectStyle(projectId, Number(version), stylePrompt);

    res.status(200).json({
      message: 'Style saved successfully, pipeline advanced.',
      project: updatedProject
    });

  } catch (error: any) {
    if (error.message === 'OCC_CONFLICT') {
      res.status(409).json({ error: 'Conflict: The pipeline was modified in another session. Please refresh.' });
      return;
    }
    console.error('Error advancing project style:', error);
    res.status(500).json({ error: 'Failed to update project style.' });
  }
};