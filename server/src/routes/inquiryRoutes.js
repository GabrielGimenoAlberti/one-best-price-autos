import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createInquiry } from '../controllers/inquiryController.js';

const router = Router();

// 10 submissions per hour per IP
const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many inquiries, please try again later' },
});

router.post('/', inquiryLimiter, createInquiry);

export default router;