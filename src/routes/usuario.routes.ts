import { Router } from "express";
import {
    getUsuariosHandler,
    getUsuarioByIdHandler,
    getUsuarioCredentialsHandler,
    createUsuarioHandler,
    updateUsuarioHandler,
    deleteUsuarioHandler
} from "../controllers/usuario/usuario.controller";
import {
    validateBody,
    validateParams
} from '../middleware/validate.middleware';
import {
    createUserSchema,
    updateUserSchema,
    urlParamsSchema
} from '../validations/usuarioSchema';

const router = Router();

//Get all Usuarios
router.get('/', getUsuariosHandler);

//Get Usuario by ID
router.get('/:id', validateParams(urlParamsSchema), getUsuarioByIdHandler);

//Get Usuario Credentials
router.get('/credentials/list', getUsuarioCredentialsHandler);

//Post Usuario
router.post('/', validateBody(createUserSchema), createUsuarioHandler);

//Patch Usuario
router.patch('/:id', validateParams(urlParamsSchema), validateBody(updateUserSchema), updateUsuarioHandler);

//Delete Usuario
router.delete('/:id', validateParams(urlParamsSchema), deleteUsuarioHandler);

export default router;
