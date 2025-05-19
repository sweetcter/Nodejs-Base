import { formatController } from '@/controllers';
import { createFormatSchema, updateFormatSchema } from '@/validations/format/formatSchema';
import { validator } from '@/validations/schemaValidator';
import { Router } from 'express';

const router = Router();

router.get('/all', formatController.getAllFormats);
router.get('/:id', formatController.getDetailFormat);

router.post('/create', validator(createFormatSchema), formatController.createFormat);

router.put('/update/:id', validator(updateFormatSchema), formatController.updateFormat);

export default router;
