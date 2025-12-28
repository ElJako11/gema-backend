export type CreateTrabajoParams = {
    idC?: number | null;
    idU: number;
    nombre: string;
    fecha: string;
    est: string;
    tipo: 'Mantenimiento' | 'Inspeccion';
}
