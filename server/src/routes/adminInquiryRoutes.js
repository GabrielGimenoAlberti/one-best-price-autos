import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { listInquiries, updateInquiryStatus, deleteInquiry } from '../controllers/inquiryController.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/', listInquiries);
router.put('/:id', updateInquiryStatus);
router.delete('/:id', deleteInquiry);

export default router;