import { Router } from 'express';
import { startConversation, talk } from '../controllers/chatController';

const router = Router();

router.post('/startConversation', startConversation);
router.post('/talk', talk);

export default router;
