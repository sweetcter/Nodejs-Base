import { Router } from 'express';
import categoryRoutes from './category.routes';
import authRoutes from './auth.routes';
import vendorRoutes from './vendor.routes';
import formatRoutes from './format.routes';

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/auth', authRoutes);
router.use('/vendors', vendorRoutes);
router.use('/formats', formatRoutes);

export default router;
