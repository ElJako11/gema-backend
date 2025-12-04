export type CreateTrabajoParams = {
    idC: number;
    idU: number;
    nombre: string;
    fecha: string;
    est: string;
    tipo: 'Mantenimiento' | 'Inspeccion';
}
