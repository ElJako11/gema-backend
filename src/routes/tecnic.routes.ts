import { Router } from 'express';
import {
getAllTecnicosHandler,
createTecnicoHandler,
updateTecnicoHandler,
deleteTecnicoHandler
} from '../controllers/tecnico/tecnico.controller';
import {
    validateBody,
    validateParams
} from '../middleware/validate.middleware'
import {
    createTecnicoSchema,
    updateTecnicoSchema,
    urlParamsTecnicoSchema
} from '../validations/tecnicSchema'

const router = Router();
//Get all Tecnicos
router.get('/', getAllTecnicosHandler);

//Post Tecnico
router.post('/', validateBody(createTecnicoSchema), createTecnicoHandler);

//Patch Tecnico
router.patch('/:id', validateParams(urlParamsTecnicoSchema), validateBody(updateTecnicoSchema), updateTecnicoHandler);

//Delete Tecnico
router.delete('/:id', validateParams(urlParamsTecnicoSchema), deleteTecnicoHandler);

export default router;