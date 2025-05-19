import { authController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { Router } from 'express';

const router = Router();
console.log('auth.routes.ts loaded ✅');

// Đăng ký tài khoản
router.post('/register', authController.register);

// Đăng nhập tài khoản
router.post('/login', authController.login);

// Làm mới access token
router.get('/refresh', authenticate, authController.refresh);

export default router;
