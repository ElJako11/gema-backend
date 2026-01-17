import express from 'express';
import cors from 'cors';
import { db } from './config/db';
import routes from './router';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import cookieParser from 'cookie-parser';
import { initScheduledJobs } from './services/cron/cron.service';

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);

// Configuración del CORS.
app.use(
  cors({
    origin: ['http://localhost:5173', process.env.PRODUCTION_URL as string],
    credentials: true,
  })
);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta de prueba "Hola Mundo"
app.get('/hola', (_req, res) => {
  res.json({ mensaje: 'Hola mundo' });
});

app.use('/', routes);

initScheduledJobs();

(async () => {
  try {
    await db.execute('SELECT 1');
    console.log('Connected to PostgreSQL via Drizzle ORM.');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
  });
})();
