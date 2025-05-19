import { vendorController } from '@/controllers';
import { validator } from '@/validations/schemaValidator';
import { createVendorSchema, updateVendorSchema } from '@/validations/vendor/vendorSchema';
import { Router } from 'express';

const router = Router();

router.get('/all', vendorController.getAllVendors);
router.get('/:id', vendorController.getDetailVendor);

router.post('/create', validator(createVendorSchema), vendorController.createVendor);

router.put('/update/:id', validator(updateVendorSchema), vendorController.updateVendor);

export default router;
