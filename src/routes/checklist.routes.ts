import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  deleteChecklistHandler,
  getChecklistHandler,
  getChecklistByIDHandler,
  createChecklistHandler,
  updateChecklistHandler,
} from '../controllers/checklist/checklist.controller';
import { autorizationMiddleware } from '../middleware/autorization.middleware'; 
import * as middleware from '../middleware/validate.middleware'
import * as validators from '../validations/checklistSchema';

const router = Router();

//get all checklists
router.get('/', authenticate, autorizationMiddleware(), middleware.validateParams(validators.urlParamsSchema), getChecklistHandler);

//get checklist by ID
router.get('/:id', authenticate, autorizationMiddleware(), middleware.validateParams(validators.urlParamsSchema), getChecklistByIDHandler);

//create checklist
router.post('/', authenticate, autorizationMiddleware(), middleware.validateBody(validators.createChecklistSchema), createChecklistHandler);

//update checklist
router.put('/:id', authenticate, autorizationMiddleware(), middleware.validateParams(validators.urlParamsSchema), middleware.validateBody(validators.updateChecklistSchema), updateChecklistHandler);

//delete checklist
router.delete(
  '/:id',
  authenticate,
  autorizationMiddleware(),
  middleware.validateParams(validators.urlParamsSchema),
  deleteChecklistHandler,
);

export default router;
