import path from 'path';
import fs from 'fs-extra';
import handlebars from 'handlebars';
import { db } from '../../config/db'; // Ajusta rutas según tu proyecto
import { eq, between } from 'drizzle-orm';
import { mantenimiento } from '../../tables/mantenimiento';
import { trabajo } from '../../tables/trabajo';
import { ubicacionTecnica } from '../../tables/ubicacionTecnica';
import { PdfEngineService } from '../pdfEngine/pdfEngine.service';
import { getStartOfWeek, getStartofMonth, getEndofMonth, Add } from '../../utils/dateHandler';

// Interfaz para la vista del PDF
interface MaintenanceViewData {
  tituloRango: string;
  fechaGeneracion: string;
  mantenimientos: Array<{
    nombreTrabajo: string;
    estado: string;
    claseEstado: string; // Para CSS
    ubicacion: string;
    fechaLimiteFormateada: string;
  }>;
}

export class MaintenancePdfService {
  private pdfEngine: PdfEngineService;

  constructor() {
    this.pdfEngine = new PdfEngineService();
  }

  // Helper para convertir estado DB -> Clase CSS
  private getStatusClass(estado: string): string {
    const lower = estado.toLowerCase();
    if (lower.includes('ejecuci')) return 'en-ejecucion';
    if (lower.includes('reprogramado')) return 'reprogramado';
    if (lower.includes('culminado')) return 'culminado';
    return 'no-empezado';
  }

  // Query específica para el reporte (Incluye titulo del trabajo)
  private async fetchMaintenanceData(initialISO: string, finalISO: string) {
    return await db
      .select({
        nombreTrabajo: trabajo.nombre, // <--- ESTO FALTABA EN TU QUERY ORIGINAL
        estado: trabajo.est,
        ubicacion: ubicacionTecnica.descripcion,
        fechaLimite: mantenimiento.fechaLimite,
      })
      .from(mantenimiento)
      .innerJoin(trabajo, eq(mantenimiento.idTrabajo, trabajo.idTrabajo))
      .innerJoin(ubicacionTecnica, eq(ubicacionTecnica.idUbicacion, trabajo.idU))
      .where(between(mantenimiento.fechaLimite, initialISO, finalISO));
  }

  async generateSummaryPdf(dateStr: string, filterType: 'mensual' | 'semanal'): Promise<Buffer> {
    let initialISO = '';
    let finalISO = '';
    let tituloRango = '';

    // 1. Lógica de Fechas (Reutilizando tu lógica existente)
    if (filterType === 'mensual') {
      const iDate = getStartofMonth(dateStr);
      const fDate = getEndofMonth(dateStr);
      initialISO = iDate.toISOString().split('T')[0];
      finalISO = fDate.toISOString().split('T')[0];
      
      // Formato bonito: "Noviembre 2025"
      tituloRango = iDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    } else {
      const iDate = getStartOfWeek(dateStr);
      const fDate = Add(iDate);
      initialISO = iDate.toISOString().split('T')[0];
      finalISO = fDate.toISOString().split('T')[0];
      
      tituloRango = `Semana del ${iDate.getDate()} al ${fDate.getDate()} de ${iDate.toLocaleDateString('es-ES', { month: 'long' })}`;
    }

    // 2. Obtener datos
    const rawData = await this.fetchMaintenanceData(initialISO, finalISO);

    // 3. Preparar datos para Handlebars
    const viewData: MaintenanceViewData = {
      tituloRango: tituloRango.toUpperCase(),
      fechaGeneracion: new Date().toLocaleDateString('es-ES'),
      mantenimientos: rawData.map(m => ({
        nombreTrabajo: m.nombreTrabajo,
        estado: m.estado,
        claseEstado: this.getStatusClass(m.estado),
        ubicacion: m.ubicacion,
        fechaLimiteFormateada: new Date(m.fechaLimite).toLocaleDateString('es-ES')
      }))
    };

    // 4. Renderizar
    const templatePath = path.join(process.cwd(), 'src', 'templates', 'resumenMantenimiento.hbs');
    const templateHtml = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateHtml);
    const finalHtml = template(viewData);

    return await this.pdfEngine.generatePdfFromHtml(finalHtml);
  }
}