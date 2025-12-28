import { Router } from 'express';
import { exportChecklistPdf } from '../controllers/pdfChecklist/pdfChecklist.controller';
import { authenticate } from '../middleware/auth.middleware';
import { autorizationMiddleware } from '../middleware/autorization.middleware';

const router = Router();

router.get('/:id/pdf', authenticate, autorizationMiddleware(), exportChecklistPdf);

export default router;