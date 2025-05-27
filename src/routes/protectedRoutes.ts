import express from 'express';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { authorize } from '@/middlewares/authorizeMiddleware';
import { ROLE } from '@/constants/allowRoles';

const router = express.Router();

// Route chỉ cho admin truy cập
router.get('/admin', authenticate, authorize(ROLE.ADMIN), (req, res) => {
    res.send('Chỉ admin mới truy cập được');
});

router.get('/admin', authenticate, authorize(ROLE.ADMIN, ROLE.MANAGER), (req, res) => {
    res.send('Chỉ admin va manager mới truy cập được');
});

// Route cho admin, manager và user đều được truy cập
router.get('/dashboard', authenticate, authorize(ROLE.ADMIN, ROLE.ADMIN, ROLE.USER), (req, res) => {
    res.send('Admin, manager và user đều có thể truy cập');
});

// Route public không cần auth
router.get('/public', (req, res) => {
    res.send('Trang công khai ai cũng xem được');
});

export default router;
