import { authController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/refresh', authenticate, authController.refresh);

export default router;
