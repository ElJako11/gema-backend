import { db } from '../config/db';

import { usuarios } from '../tables/usuarios';
import { checklist } from '../tables/checklist';
import { grupoDeTrabajo } from '../tables/grupoDeTrabajo';
import { grupoXtrabajo } from '../tables/grupoXtrabajo';
import { incluyen } from '../tables/incluyen';
import { inspeccion } from '../tables/inspeccion';
import { itemChecklist } from '../tables/item-checklist';
import { mantenimiento_inspeccion } from '../tables/mantenimiento-inspeccion';
import { mantenimiento } from '../tables/mantenimiento';
import { tecnico } from '../tables/tecnico';
import { trabajaEnGrupo } from '../tables/trabajaEnGrupo';
import { trabajo } from '../tables/trabajo';
import { ubicacionTecnica } from '../tables/ubicacionTecnica';

export const usuariosData = [
  {
    Nombre: 'Juan Pérez',
    Correo: 'juan.perez@ucab.edu.ve',
    Tipo: 'SUPERVISOR',
    Contraseña: 'hashed_password_1',
  },
  {
    Nombre: 'Maria Acosta',
    Correo: 'maria.acosta@ucab.edu.ve',
    Tipo: 'DIRECTOR',
    Contraseña: 'hashed_password_2',
  },
  {
    Nombre: 'Carlos Ruiz',
    Correo: 'carlos.ruiz@ucab.edu.ve',
    Tipo: 'SUPERVISOR',
    Contraseña: 'hashed_password_3',
  },
  {
    Nombre: 'Ana Lopez',
    Correo: 'ana.lopez@ucab.edu.ve',
    Tipo: 'DIRECTOR',
    Contraseña: 'hashed_password_4',
  },
  {
    Nombre: 'Luis Torres',
    Correo: 'luis.torres@ucab.edu.ve',
    Tipo: 'SUPERVISOR',
    Contraseña: 'hashed_password_5',
  },
];

export const checklistData = [
  { nombre: 'Checklist Seguridad' },
  { nombre: 'Checklist Calidad' },
  { nombre: 'Checklist Diario' },
  { nombre: 'Checklist Semanal' },
  { nombre: 'Checklist Maquinaria' },
];

export const tecnicoData = [
  {
    nombre: 'Tecnico Uno',
    direccion: 'Calle 1 #10-20',
  },
  {
    nombre: 'Tecnico Dos',
    direccion: 'Av. Siempre Viva 123',
  },
  {
    nombre: 'Tecnico Tres',
    direccion: 'Carrera 50 #20-10',
  },
  {
    nombre: 'Tecnico Cuatro',
    direccion: 'Calle 80 #15-05',
  },
  {
    nombre: 'Tecnico Cinco',
    direccion: 'Transversal 10 #5-50',
  },
];

export const ubicacionTecnicaData = [
  {
    descripcion: 'Planta Principal',
    abreviacion: 'PP',
    codigo_Identificacion: 'LOC-001',
    nivel: 1,
    estaHabilitado: true,
  },
  {
    descripcion: 'Bodega Norte',
    abreviacion: 'BN',
    codigo_Identificacion: 'LOC-002',
    nivel: 1,
    estaHabilitado: true,
  },
  {
    descripcion: 'Sala de Maquinas',
    abreviacion: 'SM',
    codigo_Identificacion: 'LOC-003',
    nivel: 2,
    estaHabilitado: true,
  },
  {
    descripcion: 'Oficina Tecnica',
    abreviacion: 'OT',
    codigo_Identificacion: 'LOC-004',
    nivel: 2,
    estaHabilitado: true,
  },
  {
    descripcion: 'Patio de Maniobras',
    abreviacion: 'PM',
    codigo_Identificacion: 'LOC-005',
    nivel: 1,
    estaHabilitado: true,
  },
];

export const grupoDeTrabajoData = [
  {
    codigo: 'G-001',
    nombre: 'Grupo Alpha',
    area: 'Mantenimiento',
    supervisorId: 1,
  },
  {
    codigo: 'G-002',
    nombre: 'Grupo Beta',
    area: 'Inspeccion',
    supervisorId: 3,
  },
  {
    codigo: 'G-003',
    nombre: 'Grupo Gamma',
    area: 'Logistica',
    supervisorId: 5,
  },
  {
    codigo: 'G-004',
    nombre: 'Grupo Delta',
    area: 'Seguridad',
    supervisorId: 1,
  },
  {
    codigo: 'G-005',
    nombre: 'Grupo Epsilon',
    area: 'Operaciones',
    supervisorId: 3,
  },
];

export const incluyenData = [
  { idPadre: 1, idHijo: 3, esUbicacionFisica: true },
  { idPadre: 1, idHijo: 4, esUbicacionFisica: true },
  { idPadre: 2, idHijo: 5, esUbicacionFisica: false },
  { idPadre: 3, idHijo: 4, esUbicacionFisica: true },
  { idPadre: 2, idHijo: 3, esUbicacionFisica: false },
];

export const trabajoData = [
  // Inspecciones
  {
    idC: 1,
    idU: 1,
    nombre: 'Inspeccion General',
    fecha: '2025-01-10',
    est: 'Pendiente',
    tipo: 'Inspeccion',
  },
  {
    idC: 2,
    idU: 2,
    nombre: 'Inspeccion Calidad Bodega',
    fecha: '2025-01-11',
    est: 'En Proceso',
    tipo: 'Inspeccion',
  },
  {
    idC: 3,
    idU: 3,
    nombre: 'Revision Maquinas',
    fecha: '2025-01-12',
    est: 'Completado',
    tipo: 'Inspeccion',
  },
  {
    idC: 4,
    idU: 4,
    nombre: 'Auditoria Oficina',
    fecha: '2025-01-13',
    est: 'Pendiente',
    tipo: 'Inspeccion',
  },
  {
    idC: 5,
    idU: 5,
    nombre: 'Verificacion Patio',
    fecha: '2025-01-14',
    est: 'Cancelado',
    tipo: 'Inspeccion',
  },
  // Mantenimientos
  {
    idC: 1,
    idU: 1,
    nombre: 'Mantenimiento Preventivo A',
    fecha: '2025-02-01',
    est: 'Asignado',
    tipo: 'Mantenimiento',
  },
  {
    idC: 2,
    idU: 2,
    nombre: 'Mantenimiento Correctivo B',
    fecha: '2025-02-02',
    est: 'En Proceso',
    tipo: 'Mantenimiento',
  },
  {
    idC: 3,
    idU: 3,
    nombre: 'Cambio Repuestos C',
    fecha: '2025-02-03',
    est: 'Completado',
    tipo: 'Mantenimiento',
  },
  {
    idC: 4,
    idU: 4,
    nombre: 'Limpieza D',
    fecha: '2025-02-04',
    est: 'Asignado',
    tipo: 'Mantenimiento',
  },
  {
    idC: 5,
    idU: 5,
    nombre: 'Ajuste Maquinaria E',
    fecha: '2025-02-05',
    est: 'Pendiente',
    tipo: 'Mantenimiento',
  },
];

export const itemChecklistData = [
  { idCheck: 1, descripcion: 'Verificar luces' },
  { idCheck: 1, descripcion: 'Verificar puertas' },
  { idCheck: 2, descripcion: 'Medir temperatura' },
  { idCheck: 3, descripcion: 'Revisar niveles de aceite' },
  { idCheck: 4, descripcion: 'Comprobar conexiones' },
];

export const grupoXtrabajoData = [
  { idG: 1, idT: 6 }, // Grupo 1 -> Mantenimiento 1
  { idG: 2, idT: 7 }, // Grupo 2 -> Mantenimiento 2
  { idG: 3, idT: 8 }, // Grupo 3 -> Mantenimiento 3
  { idG: 4, idT: 1 }, // Grupo 4 -> Inspeccion 1
  { idG: 5, idT: 2 }, // Grupo 5 -> Inspeccion 2
];

export const trabajaEnGrupoData = [
  { tecnicoId: 1, grupoDeTrabajoId: 1 }, // User 1 (Supervisor) en Grupo 1
  { tecnicoId: 2, grupoDeTrabajoId: 2 }, // User 2 (Director) en Grupo 2
  { tecnicoId: 3, grupoDeTrabajoId: 3 }, // User 3 (Supervisor) en Grupo 3
  { tecnicoId: 4, grupoDeTrabajoId: 4 }, // User 4 (Director) en Grupo 4
  { tecnicoId: 5, grupoDeTrabajoId: 5 }, // User 5 (Supervisor) en Grupo 5
];

export const inspeccionData = [
  {
    id: 1,
    idT: 1,
    observacion: 'Todo en orden',
    frecuencia: 'Semanal',
  },
  {
    id: 2,
    idT: 2,
    observacion: 'Requiere limpieza',
    frecuencia: 'Diaria',
  },
  {
    id: 3,
    idT: 3,
    observacion: 'Desgaste leve',
    frecuencia: 'Mensual',
  },
  {
    id: 4,
    idT: 4,
    observacion: 'Falta iluminacion',
    frecuencia: 'Trimestral',
  },
  {
    id: 5,
    idT: 5,
    observacion: 'Acceso bloqueado',
    frecuencia: 'Anual',
  },
];

export const mantenimientoData = [
  {
    idTrabajo: 6,
    fechaLimite: '2025-02-10',
    prioridad: 'Alta',
    resumen: 'Cambio de filtros',
    tipo: 'Periodico',
    frecuencia: 'Semestral',
    instancia: 'Instancia 1',
    condicion: 'Operativo',
  },
  {
    idTrabajo: 7,
    fechaLimite: '2025-02-12',
    prioridad: 'Media',
    resumen: 'Reparacion de fuga',
    tipo: 'Condicion',
    frecuencia: 'N/A',
    instancia: 'Instancia 2',
    condicion: 'Parada por falla',
  },
  {
    idTrabajo: 8,
    fechaLimite: '2025-02-15',
    prioridad: 'Baja',
    resumen: 'Engrase general',
    tipo: 'Periodico',
    frecuencia: 'Mensual',
    instancia: 'Instancia 3',
    condicion: 'Operativo',
  },
  {
    idTrabajo: 9,
    fechaLimite: '2025-02-20',
    prioridad: 'Alta',
    resumen: 'Limpieza profunda',
    tipo: 'Periodico',
    frecuencia: 'Semanal',
    instancia: 'Instancia 1',
    condicion: 'Operativo',
  },
  {
    idTrabajo: 10,
    fechaLimite: '2025-02-25',
    prioridad: 'Critica',
    resumen: 'Calibracion sensores',
    tipo: 'Condicion',
    frecuencia: 'N/A',
    instancia: 'Instancia 4',
    condicion: 'Descalibrado',
  },
];

export const mantenimientoInspeccionData = [
  { idInspeccion: 1, nombre: 'Punto Control A' },
  { idInspeccion: 2, nombre: 'Punto Control B' },
  { idInspeccion: 3, nombre: 'Punto Control C' },
  { idInspeccion: 4, nombre: 'Punto Control D' },
  { idInspeccion: 5, nombre: 'Punto Control E' },
];

//* Inserciones en las tablas.
const fillDB = async () => {
  try {
    await db.insert(usuarios).values(usuariosData as any);
    await db.insert(checklist).values(checklistData);
    await db.insert(tecnico).values(tecnicoData);
    await db.insert(ubicacionTecnica).values(ubicacionTecnicaData);
    await db.insert(grupoDeTrabajo).values(grupoDeTrabajoData);
    await db.insert(incluyen).values(incluyenData);
    await db.insert(trabajo).values(trabajoData as any);
    await db.insert(itemChecklist).values(itemChecklistData);
    await db.insert(grupoXtrabajo).values(grupoXtrabajoData);
    await db.insert(trabajaEnGrupo).values(trabajaEnGrupoData);
    await db.insert(inspeccion).values(inspeccionData);
    await db.insert(mantenimiento).values(mantenimientoData as any);
    await db
      .insert(mantenimiento_inspeccion)
      .values(mantenimientoInspeccionData);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

fillDB();
