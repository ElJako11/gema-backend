
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodTypeAny, ZodError } from 'zod';

/**
 * Validate request body with a Zod schema
 */
export const validateBody = (schema: ZodTypeAny): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {

      schema.parse(req.body);
      
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
      schema.parse(req.params);
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
      schema.parse(req.query);
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