import { Router } from 'express';
import { health } from '../controllers/HealthController';

const router = Router();
router.get('/health', health);

export default router;
