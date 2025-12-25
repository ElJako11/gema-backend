import { Router } from 'express';
import {
getAllTecnicosHandler,
getListaTecnicosHandler,
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

//Get lista de Tecnicos
router.get('/lista', getListaTecnicosHandler);

//Post Tecnico
router.post('/', validateBody(createTecnicoSchema), createTecnicoHandler);

//Patch Tecnico
router.patch('/:id', validateParams(urlParamsTecnicoSchema), validateBody(updateTecnicoSchema), updateTecnicoHandler);

//Delete Tecnico
router.delete('/:id', validateParams(urlParamsTecnicoSchema), deleteTecnicoHandler);

export default router;