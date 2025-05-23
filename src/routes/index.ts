import { Router } from 'express';
import categoryRoutes from './category.routes';
import authRoutes from './auth.routes';
import vendorRoutes from './vendor.routes';
import formatRoutes from './format.routes';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/auth', authRoutes);
router.use('/vendors', vendorRoutes);
router.use('/formats', formatRoutes);
router.use('/products', productRoutes);
router.use('/carts', cartRoutes);

export default router;
