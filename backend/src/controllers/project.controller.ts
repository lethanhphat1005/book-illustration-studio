import { Request, Response } from 'express';
import { getProjectsByUserId } from '../services/project.service';

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