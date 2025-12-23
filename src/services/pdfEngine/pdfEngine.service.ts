import puppeteer from 'puppeteer';

export class PdfEngineService {
  /**
   * Recibe HTML crudo y devuelve un Buffer de PDF.
   * No le importa de qué trata el documento.
   */
  async generatePdfFromHtml(htmlContent: string): Promise<Buffer> {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    try {
      const page = await browser.newPage();
      
      // Renderizar contenido
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      // Configuración global de impresión (A4, márgenes)
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' }
      });

      return Buffer.from(pdfBuffer);
    } finally {
      // El finally asegura que el navegador se cierre aunque haya error
      await browser.close();
    }
  }
}