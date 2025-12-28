import { db } from '../config/db';
import { sql } from 'drizzle-orm';

// Importación de Tablas
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
import { estadoItemChecklist } from '../tables/estadoItemChecklist';
import { plantilla } from '../tables/plantilla';      
import { itemPlantilla } from '../tables/itemPlantilla'; 

// --- DATOS ESTÁTICOS ---

// Usuarios: Se insertarán después del Coordinador (ID 1).
// Por lo tanto: Juan(2), Maria(3), Carlos(4), Ana(5), Luis(6).
export const usuariosData = [
  { Nombre: 'Juan Pérez', Correo: 'juan.perez@ucab.edu.ve', Tipo: 'SUPERVISOR', Contraseña: 'hashed_password_1' },
  { Nombre: 'Maria Acosta', Correo: 'maria.acosta@ucab.edu.ve', Tipo: 'DIRECTOR', Contraseña: 'hashed_password_2' },
  { Nombre: 'Carlos Ruiz', Correo: 'carlos.ruiz@ucab.edu.ve', Tipo: 'SUPERVISOR', Contraseña: 'hashed_password_3' },
  { Nombre: 'Ana Lopez', Correo: 'ana.lopez@ucab.edu.ve', Tipo: 'DIRECTOR', Contraseña: 'hashed_password_4' },
  { Nombre: 'Luis Torres', Correo: 'luis.torres@ucab.edu.ve', Tipo: 'SUPERVISOR', Contraseña: 'hashed_password_5' },
];

export const checklistData = [
  { nombre: 'Checklist Seguridad' },
  { nombre: 'Checklist Calidad' },
  { nombre: 'Checklist Diario' },
  { nombre: 'Checklist Semanal' },
  { nombre: 'Checklist Maquinaria' },
];

export const plantillaData = [
    { nombre: 'Plantilla Mantenimiento General' },
    { nombre: 'Plantilla Inspección Seguridad' },
    { nombre: 'Plantilla Revisión Eléctrica' },
];

export const itemPlantillaData = [
    { idPlantilla: 1, titulo: 'Revisión Visual', descripcion: 'Inspeccionar visualmente el equipo en busca de daños.' },
    { idPlantilla: 1, titulo: 'Limpieza', descripcion: 'Limpiar superficie y componentes externos.' },
    { idPlantilla: 2, titulo: 'Extintores', descripcion: 'Verificar fecha de vencimiento y presión.' },
    { idPlantilla: 2, titulo: 'Salidas de Emergencia', descripcion: 'Asegurar que no estén bloqueadas.' },
    { idPlantilla: 3, titulo: 'Voltaje', descripcion: 'Medir voltaje de entrada y salida.' },
];

// GRUPOS DE TRABAJO
// supervisorId apunta a USUARIOS. Como el ID 1 es Coordinador, usamos 2, 4, 6 (Juan, Carlos, Luis).
export const grupoDeTrabajoData = [
  { codigo: 'G-001', nombre: 'Grupo Alpha', area: 'Mantenimiento', supervisorId: 2 }, 
  { codigo: 'G-002', nombre: 'Grupo Beta', area: 'Inspeccion', supervisorId: 4 },    
  { codigo: 'G-003', nombre: 'Grupo Gamma', area: 'Logistica', supervisorId: 6 },    
  { codigo: 'G-004', nombre: 'Grupo Delta', area: 'Seguridad', supervisorId: 2 },    
  { codigo: 'G-005', nombre: 'Grupo Epsilon', area: 'Operaciones', supervisorId: 4 },
];

// TECNICOS
// La tabla tecnico se limpia (TRUNCATE), así que sus IDs serán 1, 2, 3, 4, 5.
export const tecnicoData = [
  { idGT: 1, nombre: 'Tecnico Uno', correo: 't1@test.com' },
  { idGT: 2, nombre: 'Tecnico Dos', correo: 't2@test.com' },
  { idGT: 3, nombre: 'Tecnico Tres', correo: 't3@test.com' },
  { idGT: 4, nombre: 'Tecnico Cuatro', correo: 't4@test.com' },
  { idGT: 5, nombre: 'Tecnico Cinco', correo: 't5@test.com' },
];

// UBICACIONES
// La tabla se limpia, IDs serán 1, 2, 3, 4, 5.
export const ubicacionTecnicaData = [
  { descripcion: 'Planta Principal', abreviacion: 'PP', codigo_Identificacion: 'LOC-001', nivel: 1, estaHabilitado: true },
  { descripcion: 'Bodega Norte', abreviacion: 'BN', codigo_Identificacion: 'LOC-002', nivel: 1, estaHabilitado: true },
  { descripcion: 'Sala de Maquinas', abreviacion: 'SM', codigo_Identificacion: 'LOC-003', nivel: 2, estaHabilitado: true },
  { descripcion: 'Oficina Tecnica', abreviacion: 'OT', codigo_Identificacion: 'LOC-004', nivel: 2, estaHabilitado: true },
  { descripcion: 'Patio de Maniobras', abreviacion: 'PM', codigo_Identificacion: 'LOC-005', nivel: 1, estaHabilitado: true },
];

export const incluyenData = [
  { idPadre: 1, idHijo: 3, esUbicacionFisica: true },
  { idPadre: 1, idHijo: 4, esUbicacionFisica: true },
  { idPadre: 2, idHijo: 3, esUbicacionFisica: false },
];

// TRABAJOS
export const trabajoData = [
  // Inspecciones (IDs 1-5)
  { idC: 1, idU: 1, nombre: 'Inspeccion General', fecha: '2025-01-10', est: 'Pendiente', tipo: 'Inspeccion' },
  { idC: 2, idU: 2, nombre: 'Inspeccion Calidad Bodega', fecha: '2025-01-11', est: 'En Proceso', tipo: 'Inspeccion' },
  { idC: 3, idU: 3, nombre: 'Revision Maquinas', fecha: '2025-01-12', est: 'Completado', tipo: 'Inspeccion' },
  { idC: 4, idU: 4, nombre: 'Auditoria Oficina', fecha: '2025-01-13', est: 'Pendiente', tipo: 'Inspeccion' },
  { idC: 5, idU: 5, nombre: 'Verificacion Patio', fecha: '2025-01-14', est: 'Cancelado', tipo: 'Inspeccion' },
  // Mantenimientos (IDs 6-10)
  { idC: 1, idU: 1, nombre: 'Mantenimiento Preventivo A', fecha: '2025-02-01', est: 'Asignado', tipo: 'Mantenimiento' },
  { idC: 2, idU: 2, nombre: 'Mantenimiento Correctivo B', fecha: '2025-02-02', est: 'En Proceso', tipo: 'Mantenimiento' },
  { idC: 3, idU: 3, nombre: 'Cambio Repuestos C', fecha: '2025-02-03', est: 'Completado', tipo: 'Mantenimiento' },
  { idC: 4, idU: 4, nombre: 'Limpieza D', fecha: '2025-02-04', est: 'Asignado', tipo: 'Mantenimiento' },
  { idC: 5, idU: 5, nombre: 'Ajuste Maquinaria E', fecha: '2025-02-05', est: 'Pendiente', tipo: 'Mantenimiento' },
];

export const itemChecklistData = [
  { idCheck: 1, titulo: 'Luces', descripcion: 'Verificar luces' },
  { idCheck: 1, titulo: 'Puertas', descripcion: 'Verificar puertas' },
  { idCheck: 2, titulo: 'Temperatura', descripcion: 'Medir temperatura' },
  { idCheck: 3, titulo: 'Aceite', descripcion: 'Revisar niveles de aceite' },
  { idCheck: 4, titulo: 'Conexiones', descripcion: 'Comprobar conexiones' },
];

export const grupoXtrabajoData = [
  { idG: 1, idT: 6 },
  { idG: 2, idT: 7 },
  { idG: 3, idT: 8 },
  { idG: 4, idT: 1 },
  { idG: 5, idT: 2 },
];

export const trabajaEnGrupoData = [
  { tecnicoId: 1, grupoDeTrabajoId: 1 },
  { tecnicoId: 2, grupoDeTrabajoId: 2 },
  { tecnicoId: 3, grupoDeTrabajoId: 3 },
  { tecnicoId: 4, grupoDeTrabajoId: 4 },
  { tecnicoId: 5, grupoDeTrabajoId: 5 },
];

export const inspeccionData = [
  { id: 1, idT: 1, observacion: 'Todo en orden', frecuencia: 'Semanal' },
  { id: 2, idT: 2, observacion: 'Requiere limpieza', frecuencia: 'Diaria' },
  { id: 3, idT: 3, observacion: 'Desgaste leve', frecuencia: 'Mensual' },
  { id: 4, idT: 4, observacion: 'Falta iluminacion', frecuencia: 'Trimestral' },
  { id: 5, idT: 5, observacion: 'Acceso bloqueado', frecuencia: 'Anual' },
];

export const mantenimientoData = [
  { idTrabajo: 6, fechaLimite: '2026-02-01', prioridad: 'Alta', resumen: 'Cambio de filtros', tipo: 'Periodico', frecuencia: 'Semestral', instancia: 'Reabierto', condicion: 'Operativo' },
  { idTrabajo: 7, fechaLimite: '2026-02-02', prioridad: 'Media', resumen: 'Reparacion de fuga', tipo: 'Condicion', frecuencia: 'Anual',instancia: 'Reabierto', condicion: 'Parada por falla' },
  { idTrabajo: 8, fechaLimite: '2026-02-03', prioridad: 'Baja', resumen: 'Engrase general', tipo: 'Periodico', frecuencia: 'Mensual', instancia: 'No Reabierto', condicion: 'Operativo' },
  { idTrabajo: 9, fechaLimite: '2026-02-04', prioridad: 'Alta', resumen: 'Limpieza profunda', tipo: 'Periodico', frecuencia: 'Semanal', instancia: 'No Reabierto', condicion: 'Operativo' },
  { idTrabajo: 10, fechaLimite: '2026-02-05', prioridad: 'Critica', resumen: 'Calibracion sensores', tipo: 'Condicion', frecuencia: 'Anual', instancia: 'No Reabierto', condicion: 'Descalibrado' },
];

export const mantenimientoInspeccionData = [
  { idInspeccion: 1, nombre: 'Punto Control A' },
  { idInspeccion: 2, nombre: 'Punto Control B' },
  { idInspeccion: 3, nombre: 'Punto Control C' },
  { idInspeccion: 4, nombre: 'Punto Control D' },
  { idInspeccion: 5, nombre: 'Punto Control E' },
];

export const estadoItemChecklistData = [
  { idTrabajo: 1, idChecklist: 1, idItemChecklist: 1, estado: 'COMPLETADA' },
  { idTrabajo: 1, idChecklist: 1, idItemChecklist: 2, estado: 'PENDIENTE' },
  { idTrabajo: 6, idChecklist: 1, idItemChecklist: 1, estado: 'COMPLETADA' },
  { idTrabajo: 6, idChecklist: 1, idItemChecklist: 2, estado: 'COMPLETADA' },
  { idTrabajo: 2, idChecklist: 2, idItemChecklist: 3, estado: 'PENDIENTE' },
];

// --- FUNCIÓN DE LIMPIEZA ---
const cleanDb = async () => {
    console.log('🧹 Limpiando base de datos (Preservando Usuarios del initDB)...');
    
    // NO borramos Usuarios para mantener al Coordinador.
    // Todas las demás tablas se TRUNCAN y REINICIAN IDs a 1.
    
    await db.execute(sql`
      TRUNCATE TABLE 
        "mantenimientoInspeccion", 
        "estadoItemChecklist", 
        "grupoXtrabajo", 
        "mantenimiento", 
        "inspeccion", 
        "trabajo", 
        "TrabajaEnGrupo", 
        "tecnico", 
        "GrupoDeTrabajo", 
        "Incluyen", 
        "UbicacionTecnica", 
        "itemPlantilla", 
        "plantilla", 
        "itemChecklist", 
        "checklist"
      RESTART IDENTITY CASCADE;
    `);
    
    console.log('✨ Tablas secundarias limpias y contadores reiniciados.');
};

// --- INSERCIÓN ---
const fillDB = async () => {
  try {
    await cleanDb();

    console.log('🌱 Insertando datos...');

    // 1. Usuarios Adicionales (empezarán desde ID 2)
    await db.insert(usuarios).values(usuariosData as any);
    
    await db.insert(checklist).values(checklistData);
    await db.insert(plantilla).values(plantillaData);
    await db.insert(itemPlantilla).values(itemPlantillaData);

    // 2. Ubicaciones (IDs 1..5)
    await db.insert(ubicacionTecnica).values(ubicacionTecnicaData);
    await db.insert(incluyen).values(incluyenData);

    // 3. Grupos y Técnicos 
    // Grupos usan supervisorId (Usuarios -> 2,4,6)
    // Tecnicos se generan frescos (IDs 1..5)
    await db.insert(grupoDeTrabajo).values(grupoDeTrabajoData);
    await db.insert(tecnico).values(tecnicoData);
    await db.insert(trabajaEnGrupo).values(trabajaEnGrupoData);

    // 4. Items y Trabajos
    // Trabajo usa idU (Ubicacion/Tecnico -> 1..5)
    await db.insert(itemChecklist).values(itemChecklistData);
    await db.insert(trabajo).values(trabajoData as any);

    // 5. Detalles
    await db.insert(inspeccion).values(inspeccionData);
    await db.insert(mantenimiento).values(mantenimientoData as any);

    // 6. Relaciones
    await db.insert(grupoXtrabajo).values(grupoXtrabajoData);
    await db.insert(mantenimiento_inspeccion).values(mantenimientoInspeccionData);
    await db.insert(estadoItemChecklist).values(estadoItemChecklistData as any);

    console.log('✅ Seeding completado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

fillDB();