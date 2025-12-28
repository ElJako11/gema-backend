import { Router } from 'express';
import { createTrabajoFacadeHandler } from '../controllers/facades/trabajoFacade.controller';
import { validateBody } from '../middleware/validate.middleware';
import { createWorkSchema } from '../validations/workCreationSchema';

const router = Router();

router.post('/', validateBody(createWorkSchema), createTrabajoFacadeHandler);

export default router;