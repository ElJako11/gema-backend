import { Router } from 'express';
import {
  createTrabajoFacadeHandler,
  createChecklistFromTemplateHandler,
} from '../controllers/facades/trabajoFacade.controller';
import { validateBody } from '../middleware/validate.middleware';
import {
  createWorkSchema,
  createChecklistFromTemplateSchema,
} from '../validations/workCreationSchema';
import { autorizationMiddleware } from '../middleware/autorization.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Creación Globalizada
 *   description: Endpoints para la creación de trabajos de mantenimiento e inspección
 */

/**
 * @swagger
 * /work-creation:
 *   post:
 *     summary: Crea un trabajo completo con mantenimiento o inspección asociado
 *     description: Endpoint globalizado que crea un trabajo base y automáticamente crea el mantenimiento o inspección asociado, asigna al grupo y maneja transacciones.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Creación Globalizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipoTrabajo
 *               - nombre
 *               - fechaCreacion
 *               - idUbicacionTecnica
 *               - idGrupo
 *               - prioridad
 *               - frecuencia
 *             properties:
 *               tipoTrabajo:
 *                 type: string
 *                 enum: [Mantenimiento, Inspeccion]
 *                 example: Mantenimiento
 *                 description: Tipo de trabajo a crear
 *               nombre:
 *                 type: string
 *                 example: "Mantenimiento Preventivo de Compresor"
 *                 description: Nombre descriptivo del trabajo (obligatorio)
 *               fechaCreacion:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-26"
 *                 description: Fecha de creación del trabajo
 *               idUbicacionTecnica:
 *                 type: integer
 *                 example: 5
 *                 description: ID de la ubicación técnica donde se realizará el trabajo
 *               idGrupo:
 *                 type: integer
 *                 example: 2
 *                 description: ID del grupo de trabajo asignado
 *               supervisorId:
 *                 type: integer
 *                 example: 3
 *                 description: ID del supervisor (opcional)
 *               prioridad:
 *                 type: string
 *                 enum: [ALTA, MEDIA, BAJA]
 *                 example: ALTA
 *                 description: Prioridad del trabajo
 *               fechaLimite:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *                 description: Fecha límite para completar el trabajo (solo para tipoTrabajo = Mantenimiento)
 *               frecuencia:
 *                 type: string
 *                 enum: [Diaria, Semanal, Mensual, Trimestral, Anual]
 *                 example: Mensual
 *                 description: Frecuencia del trabajo
 *               tipoMantenimiento:
 *                 type: string
 *                 enum: [Periodico, Condicion]
 *                 example: Periodico
 *                 description: Tipo de mantenimiento (solo para tipoTrabajo = Mantenimiento)
 *               condicion:
 *                 type: string
 *                 example: Buena
 *                 description: Condición actual (opcional)
 *               especificacion:
 *                 type: string
 *                 example: Cambio de filtros de aire y revisión de sistema
 *                 description: Descripción detallada del trabajo (opcional)
 *               instancia:
 *                 type: string
 *                 example: Primera
 *                 description: Instancia del trabajo (opcional)
 *               resumen:
 *                 type: string
 *                 example: Revisión de filtros y aceite
 *                 description: Resumen del mantenimiento (opcional)
 *               observaciones:
 *                 type: string
 *                 example: Verificar ruidos extraños
 *                 description: Observaciones para la inspección (opcional)
 *           examples:
 *             mantenimiento:
 *               summary: Ejemplo para crear un Mantenimiento
 *               value:
 *                 tipoTrabajo: "Mantenimiento"
 *                 nombre: "Mantenimiento Preventivo Mensual"
 *                 fechaCreacion: "2024-01-12"
 *                 idUbicacionTecnica: 5
 *                 idGrupo: 2
 *                 supervisorId: 3
 *                 prioridad: "ALTA"
 *                 fechaLimite: "2024-01-20"
 *                 frecuencia: "Mensual"
 *                 tipoMantenimiento: "Periodico"
 *                 condicion: "Operativo"
 *                 resumen: "Revisión general de motores industriales"
 *                 instancia: "Fase 1"
 *             inspeccion:
 *               summary: Ejemplo para crear una Inspección
 *               value:
 *                 tipoTrabajo: "Inspeccion"
 *                 nombre: "Inspección de Seguridad Semanal"
 *                 fechaCreacion: "2024-01-12"
 *                 idUbicacionTecnica: 3
 *                 idGrupo: 1
 *                 prioridad: "MEDIA"
 *                 frecuencia: "Semanal"
 *                 observaciones: "Inspección ocular de racks y estanterías"
 *     responses:
 *       201:
 *         description: Trabajo creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/',
  autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']),
  validateBody(createWorkSchema),
  createTrabajoFacadeHandler
);

/**
 * @swagger
 * /work-creation/checklist-template:
 *   post:
 *     summary: Crear una checklist para un trabajo a partir de una plantilla
 *     tags: [Creación Globalizada]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idMantenimiento:
 *                 type: number
 *                 example: 1
 *               idInspeccion:
 *                 type: number
 *                 example: 1
 *               idPlantilla:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Checklist creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/checklist-template',
  autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']),
  validateBody(createChecklistFromTemplateSchema),
  createChecklistFromTemplateHandler
);

export default router;
