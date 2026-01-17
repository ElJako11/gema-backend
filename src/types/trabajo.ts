export type CreateTrabajoParams = {
    idC?: number | null;
    idU: number;
    nombre: string;
    fecha: string;
    est: 'No empezado' | 'En ejecución' | 'Reprogramado' | 'Culminado';
    tipo: 'Mantenimiento' | 'Inspeccion';
}
