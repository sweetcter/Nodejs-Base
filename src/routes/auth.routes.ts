import { authController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { Router } from 'express';

const router = Router();

// Đăng ký tài khoản
router.post('/register', authController.register);

// Đăng nhập tài khoản
router.post('/login', authController.login);

// Làm mới access token
router.get('/refresh', authenticate, authController.refresh);

//Xac thuc email
router.get('/verify-email', authController.verifyEmail);

export default router;
