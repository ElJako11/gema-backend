// src/services/features/ChecklistPdfService.ts
import path from 'path';
import fs from 'fs-extra';
import handlebars from 'handlebars';
import { PdfEngineService } from '../pdfEngine/pdfEngine.service'; // Importamos el motor

// Tus interfaces de datos
interface ChecklistData {
  idChecklist: number;
  nombre: string;
  items: { descripcion: string }[];
}

export class ChecklistPdfService {
  private pdfEngine: PdfEngineService;

  constructor() {
    this.pdfEngine = new PdfEngineService();
  }

  async createChecklistReport(data: ChecklistData): Promise<Buffer> {
    // 1. Buscar la plantilla específica de Checklist
    const templatePath = path.join(process.cwd(), 'src', 'templates', 'checklist.hbs');
    const templateHtml = await fs.readFile(templatePath, 'utf-8');
    
    // 2. Compilar HTML con los datos
    const template = handlebars.compile(templateHtml);
    const finalHtml = template(data);

    // 3. Usar el motor para generar el PDF
    return await this.pdfEngine.generatePdfFromHtml(finalHtml);
  }
}