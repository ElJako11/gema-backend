import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { autorizationMiddleware } from '../middleware/autorization.middleware';
import { validateBody, validateParams } from '../middleware/validate.middleware';
import {
    postItemHandler,
    putItemHandler,
    deleteItemHandler
} from '../controllers/itemPlantilla/itemPlantilla.controller';
import {
    createItemSchema,
    updateItemSchema,
    urlParamsSchema,
    plantillaIdParamSchema
} from '../validations/itemPlantillaSchema';

const router = Router();

router.post(
    '/',
    authenticate,
    autorizationMiddleware(),
    validateBody(createItemSchema),
    postItemHandler
);

router.put(
    '/:idItemPlantilla/plantilla/:idPlantilla',
    authenticate,
    autorizationMiddleware(),
    validateParams(urlParamsSchema),
    validateBody(updateItemSchema),
    putItemHandler
);

router.delete(
    '/:idItemPlantilla/plantilla/:idPlantilla',
    authenticate,
    autorizationMiddleware(),
    validateParams(urlParamsSchema),
    deleteItemHandler
);

export default router;
