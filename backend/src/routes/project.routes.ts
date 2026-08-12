import { Router } from 'express';
import { getUserProjects, createProject, advanceProjectStep, getProjectDetails, extractCharacters, generatePortraits } from '../controllers/project.controller';

const router = Router();

router.get('/', getUserProjects);
router.post('/', createProject);
router.post('/:id/advance', advanceProjectStep);
router.get('/:id', getProjectDetails);
router.post('/:id/characters', extractCharacters);
router.post('/:id/portraits', generatePortraits);

export default router;