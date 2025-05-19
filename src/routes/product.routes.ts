import { productController } from '@/controllers';
import { upload } from '@/middlewares/multerMiddleware';
import { createProductSchema } from '@/validations/product/productSchema';
import { validator } from '@/validations/schemaValidator';
import { Router } from 'express';

const router = Router();

router.post(
    '/create',
    validator(createProductSchema),
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'library', maxCount: 7 },
        { name: 'variantImages', maxCount: 5 },
    ]),
    productController.createProduct,
);

router.put('/hidden/:id', productController.hiddenProduct);

export default router;
