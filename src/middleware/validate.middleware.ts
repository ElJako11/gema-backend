
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodTypeAny, ZodError } from 'zod';

/**
 * Validate request body with a Zod schema
 */
export const validateBody = (schema: ZodTypeAny): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {

      // Parse and coerce (if schema has preprocess/coercions) and replace request body
      const parsedBody = schema.parse(req.body);

      // --- CORRECCIÓN ---
      // No reasignar req.body. En su lugar, limpiarlo y copiar las nuevas propiedades.
      // Esto evita el error "Cannot set property which has only a getter".
      Object.keys(req.body).forEach(key => delete req.body[key]);
      Object.assign(req.body, parsedBody);
      // --- FIN DE LA CORRECCIÓN ---

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue : any) => ({
          field: issue.path.join('.'), // El campo que falló (ej. 'email' o 'padres.0.idPadre')
          message: issue.message,     // El mensaje de error (ej. 'Formato de correo inválido')
        }));

        res.status(400).json({
          error: 'Error de validación de datos',
          details: errorMessages,
        });
        return;
      }
      // 4. Si es otro tipo de error (no Zod), pásalo al manejador de errores de Express
      next(error); 
    }
  };

/**
 * Validate route params (req.params) with a Zod schema
 */
export const validateParams = (schema: ZodTypeAny): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedParams = schema.parse(req.params);

      // --- CORRECCIÓN ---
      // Aplicamos la misma lógica que en validateBody para evitar errores.
      Object.keys(req.params).forEach(key => delete (req.params as any)[key]);
      Object.assign(req.params, parsedParams);
      // --- FIN DE LA CORRECCIÓN ---

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        res.status(400).json({
          error: 'Error de validación de parámetros',
          details: errorMessages,
        });
        return;
      }
      next(error);
    }
  };

/**
 * Validate query string (req.query) with a Zod schema
 */
export const validateQuery = (schema: ZodTypeAny): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedQuery = schema.parse(req.query);

      // --- CORRECCIÓN ---
      // Esta es la corrección principal para el error que reportaste.
      Object.keys(req.query).forEach(key => delete (req.query as any)[key]);
      Object.assign(req.query, parsedQuery);
      // --- FIN DE LA CORRECCIÓN ---

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        res.status(400).json({
          error: 'Error de validación en query',
          details: errorMessages,
        });
        return;
      }
      next(error);
    }
  };

// Backwards compatibility: default validate = validateBody
export const validate = validateBody;