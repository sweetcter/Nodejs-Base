import { vendorController } from '@/controllers';
import { updateCategorySchema } from '@/validations/category/categorySchema';
import { validator } from '@/validations/schemaValidator';
import { createVendorSchema } from '@/validations/vendor/vendorSchema';
import { Router } from 'express';

const router = Router();

router.get('/all', vendorController.getAllVendors);
router.get('/:id', vendorController.getDetailVendor);

router.post('/create', validator(createVendorSchema), vendorController.createVendor);

router.put('/update/:id', validator(updateCategorySchema), vendorController.updateVendor);

export default router;
