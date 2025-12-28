export type CreateEstadoItemChecklist = {
    idTrabajo: number;
    idChecklist: number;
    idItemChecklist: number;
    estado: 'COMPLETADA' | 'PENDIENTE';
};