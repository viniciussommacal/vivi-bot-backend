import { Router } from 'express';
import { health } from '../controllers/healthController';

const router = Router();
router.get('/health', health);

export default router;
