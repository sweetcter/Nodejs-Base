import { cartController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.get('/all', cartController.getUserCart);

router.patch('/add', cartController.addItemToCart);

router.patch('/update', cartController.updateCartItemQuantity);

router.delete('/remove', cartController.removeCartItem);

export default router;
