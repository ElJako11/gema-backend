import { Request, Response } from 'express';
// Asegúrate de que estas rutas de importación sean correctas en tu proyecto
import { ChecklistPdfService } from '../../services/pdfChecklist/pdfChecklist.service';
import { getChecklistWithItems } from '../../services/checklist/checklist.service';

export const exportChecklistPdf = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const checklistId = parseInt(id, 10);

    // 1. Obtener datos REALES de la BD
    const checklistDb = await getChecklistWithItems(checklistId);

    // 2. Mapear datos: Ajustamos lo que viene de la BD a lo que pide tu Plantilla HTML
    // (Por seguridad, usamos "||" por si la BD devuelve mayúsculas o minúsculas)
    const dataForPdf = {
        idChecklist: checklistDb.idChecklist,
        nombre: checklistDb.nombre, 
        items: checklistDb.items.map((item: any) => ({
            descripcion: item.descripcion || item.texto || 'Ítem sin descripción' 
        }))
    };

    // 3. Generar el PDF
    const checklistPdfService = new ChecklistPdfService();
    const pdfBuffer = await checklistPdfService.createChecklistReport(dataForPdf);

    // 4. Enviar respuesta al navegador
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=checklist-${checklistId}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);

  } catch (error: any) {
    console.error("Error generando PDF:", error);

    if (error.message === 'Checklist no encontrado' || error.message.includes('no encontrado')) {
        res.status(404).json({ message: "El checklist solicitado no existe." });
        return;
    }

    res.status(500).send("Error interno generando el reporte PDF.");
  }
};