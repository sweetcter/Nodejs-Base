import { cartController } from '@/controllers';
import { addToCartSchema, updateQuantitySchema } from '@/validations/cart/cartSchema';
import { validator } from '@/validations/schemaValidator';
import { Router } from 'express';

const router = Router();

router.get('/my-cart', cartController.getUserCart);

router.patch('/add', validator(addToCartSchema), cartController.addItemToCart);

router.patch('/update-quantity', validator(updateQuantitySchema), cartController.updateCartItemQuantity);

router.delete('/remove/:variantId', cartController.removeCartItem);

export default router;
