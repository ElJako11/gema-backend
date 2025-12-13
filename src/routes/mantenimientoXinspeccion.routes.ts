import { Router } from "express";
import {
    getMantenimientosXInspeccion,
    getMantenimientoXInspeccion,
    createMantenimientoXInspeccionHandler,
    updateMantenimientoXInspeccionHandler,
    deleteMantenimientoXInspeccionHandler
} from "../controllers/mantenimientoXinspeccion/mantenimientoXinspeccion.controller";
import { 
    validateBody,
    validateParams
} from '../middleware/validate.middleware';
import {
    createMantenimientoXInspeccionSchema,
    updateMantenimientoXInspeccionSchema,
    urlParamsSchema
} from '../validations/mantenimientoXinspeccionSchema';

const router = Router();

//Get all MantenimientosXInspeccion
router.get('/', getMantenimientosXInspeccion);

//Get MantenimientoXInspeccion by ID
router.get('/:id', validateParams(urlParamsSchema), getMantenimientoXInspeccion);

//Post MantenimientoXInspeccion
router.post('/', validateBody(createMantenimientoXInspeccionSchema), createMantenimientoXInspeccionHandler);

//Patch MantenimientoXInspeccion
router.patch('/:id', validateParams(urlParamsSchema), validateBody(updateMantenimientoXInspeccionSchema), updateMantenimientoXInspeccionHandler);

//Delete MantenimientoXInspeccion
router.delete('/:id', validateParams(urlParamsSchema), deleteMantenimientoXInspeccionHandler);
