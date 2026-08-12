// backend/src/routes/project.routes.ts
import { Router } from 'express';
import { getUserProjects, createProject } from '../controllers/project.controller';

const router = Router();

router.get('/', getUserProjects);
router.post('/', createProject);

export default router;