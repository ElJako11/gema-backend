import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  deleteChecklistHandler,
  getChecklistHandler,
  getChecklistWithItemsHandler,
  postChecklistHandler,
  putChecklistHandler,
} from '../controllers/checklist/checklist.controller';
import { autorizationMiddleware } from '../middleware/autorization.middleware';
import { validateBody, validateParams } from '../middleware/validate.middleware';
import { checklistIdParamSchema, createChecklistSchema, updateChecklistSchema } from '../validations/checklist.schema';

const router = Router();

router.get('/', authenticate, autorizationMiddleware(), getChecklistHandler);
router.get('/:id', authenticate, autorizationMiddleware(), validateParams(checklistIdParamSchema), getChecklistWithItemsHandler);
router.post('/', authenticate, autorizationMiddleware(), validateBody(createChecklistSchema), postChecklistHandler);
router.put('/:id', authenticate, autorizationMiddleware(), validateParams(checklistIdParamSchema), validateBody(updateChecklistSchema), putChecklistHandler);
router.delete(
  '/:id',
  authenticate,
  autorizationMiddleware(),
  validateParams(checklistIdParamSchema),
  deleteChecklistHandler
);

export default router;
