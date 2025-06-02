import { cartController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticateMiddleware';
import { addToCartSchema, updateQuantitySchema } from '@/validations/cart/cartSchema';
import { validator } from '@/validations/schemaValidator';
import { Router } from 'express';

const router = Router();

router.get('/my-cart', authenticate, cartController.getUserCart);

router.patch('/add', authenticate, validator(addToCartSchema), cartController.addItemToCart);

router.patch('/update-quantity', authenticate, validator(updateQuantitySchema), cartController.updateCartItemQuantity);

router.delete('/remove/:variantId', authenticate, cartController.removeCartItem);

export default router;
