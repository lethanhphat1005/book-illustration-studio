import { Router } from 'express';
import { getUserProjects, createProject, advanceProjectStep, getProjectDetails } from '../controllers/project.controller';

const router = Router();

router.get('/', getUserProjects);
router.post('/', createProject);
router.post('/:id/advance', advanceProjectStep);
router.get('/:id', getProjectDetails);

export default router;