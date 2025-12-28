import { Request, Response } from 'express';
import { MaintenancePdfService } from '../../services/pdfResumenMantenimientos/pdfResumenMantenimientos.service';

export const exportMaintenanceSummaryPdf = async (req: Request, res: Response) => {
  try {
    // Recibimos los mismos query params que tu endpoint original
    const { date, filter } = req.query;

    if (!date || typeof date !== 'string') {
      res.status(400).json({ error: 'Se requiere una fecha válida (YYYY-MM-DD)' });
      return;
    }

    // Validamos el filtro (por defecto semanal si no viene nada)
    const filterType = (filter === 'mensual') ? 'mensual' : 'semanal';

    const pdfService = new MaintenancePdfService();
    const pdfBuffer = await pdfService.generateSummaryPdf(date, filterType);

    // Nombre dinámico del archivo
    const filename = `resumen-${filterType}-${date}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error generando reporte:", error);
    res.status(500).json({ error: 'Error interno generando el PDF' });
  }
};