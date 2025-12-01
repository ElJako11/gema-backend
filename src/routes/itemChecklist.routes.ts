import { Router } from 'express';
import {
  getAllItemsHandler,
  postItemHandler,
  patchItemHandler,
  deleteItemHandler,
} from '../controllers/checklistItems/checklistItem.controller';

const router = Router();

router.get('/', getAllItemsHandler);
router.post('/', postItemHandler);
router.patch('/', patchItemHandler);
router.delete('/', deleteItemHandler);

export default router;
