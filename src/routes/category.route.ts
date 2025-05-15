import { categoryController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.get('/all', categoryController.getAllCategory);

router.post('/create', categoryController.createCategory);

export default router;
