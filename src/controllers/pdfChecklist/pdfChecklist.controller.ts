// src/controllers/ChecklistPdfController.ts
import { Request, Response } from 'express';
import { ChecklistPdfService } from '../../services/pdfChecklist/pdfChecklist.service';

export const exportChecklistPdf = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // --- MOCK DATA (Simulando DB) ---
    const mockData = {
        idChecklist: Number(id),
        nombre: "Inspección de Seguridad Mensual",
        items: [
            { descripcion: "Verificar extintores" },
            { descripcion: "Revisar salidas de emergencia" }
        ]
    };
    // --------------------------------

    // Instanciamos el servicio ESPECÍFICO de Checklist
    const checklistService = new ChecklistPdfService();
    const pdfBuffer = await checklistService.createChecklistReport(mockData);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=checklist-${id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error generando PDF");
  }
};