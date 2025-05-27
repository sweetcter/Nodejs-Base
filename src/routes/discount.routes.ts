import { discountController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.get('/all', discountController.getAllDiscounts);

export default router;
