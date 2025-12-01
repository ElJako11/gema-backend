import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  deleteChecklistHandler,
  getChecklistHandler,
  postChecklistHandler,
  putChecklistHandler,
} from '../controllers/checklist/checklist.controller';
import { autorizationMiddleware } from '../middleware/autorization.middleware';

const router = Router();

router.get('/', authenticate, autorizationMiddleware(), getChecklistHandler);
router.post('/', authenticate, autorizationMiddleware(), postChecklistHandler);
router.put('/', authenticate, autorizationMiddleware(), putChecklistHandler);
router.delete(
  '/',
  authenticate,
  autorizationMiddleware(),
  deleteChecklistHandler
);

export default router;
