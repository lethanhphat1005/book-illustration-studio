import { Router } from 'express';
import { getUserProjects } from '../controllers/project.controller';

const router = Router();

router.get('/', getUserProjects);

export default router;