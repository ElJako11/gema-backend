import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  deleteChecklistHandler,
  getChecklistHandler,
  postChecklistHandler,
  putChecklistHandler,
} from '../controllers/checklist/checklist.controller';

const router = Router();

router.get('/', authenticate(), getChecklistHandler);
router.post('/', authenticate(), postChecklistHandler);
router.put('/', authenticate(), putChecklistHandler);
router.delete('/', authenticate(), deleteChecklistHandler);

export default router;
