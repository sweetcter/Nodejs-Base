import { productController } from '@/controllers';
import { upload } from '@/middlewares/multerMiddleware';
import { createProductSchema } from '@/validations/product/productSchema';
import { validator } from '@/validations/schemaValidator';
import { Router } from 'express';

const router = Router();

router.get('/all', productController.getAllProducts);
router.get('/selling', productController.getBestSeller);
router.get('/featured', productController.getFeaturedProducts);
router.get('/variant/:productId/all', productController.getAllVariantsByProduct);
router.get('/:id', productController.getDetailProduct);

router.post(
    '/create',
    validator(createProductSchema),
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'library', maxCount: 7 },
    ]),
    productController.createProduct,
);

router.post(
    '/variant',
    upload.fields([{ name: 'variantImages', maxCount: 5 }]),
    productController.createProductVariant,
);

router.put(
    '/variant/update',
    upload.fields([{ name: 'variantImages', maxCount: 5 }]),
    productController.updateProductVariant,
);

router.put('/hidden/:id', productController.hiddenProduct);

export default router;
