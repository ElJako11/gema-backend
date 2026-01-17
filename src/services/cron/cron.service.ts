import cron from 'node-cron';
import { db } from '../../config/db';
import { eq, and } from 'drizzle-orm';
import { mantenimiento } from '../../tables/mantenimiento';
import { inspeccion } from '../../tables/inspeccion';
import { trabajo } from '../../tables/trabajo';
import { grupoXtrabajo } from '../../tables/grupoXtrabajo';
import { checklist } from '../../tables/checklist';
import { itemChecklist } from '../../tables/item-checklist';
import { estadoItemChecklist } from '../../tables/estadoItemChecklist';
import { addDays, addWeeks, addMonths, addYears, parseISO } from 'date-fns';
import { convertToStr } from '../../utils/dateHandler';
import { Tx } from '../../types/transaction';

// Helper to duplicate checklist structure
const duplicateChecklist = async (
  tx: Tx,
  originalIdChecklist: number | null,
  newIdTrabajo: number
) => {
  if (!originalIdChecklist) return null;

  // 1. Fetch original checklist
  const originalChecklist = await tx
    .select()
    .from(checklist)
    .where(eq(checklist.idChecklist, originalIdChecklist));
  if (originalChecklist.length === 0) return null;
  const originalInfo = originalChecklist[0];

  // 2. Create NEW Checklist
  const [newChecklist] = await tx
    .insert(checklist)
    .values({
      nombre: originalInfo.nombre,
    })
    .returning();

  // 3. Fetch original items
  const originalItems = await tx
    .select()
    .from(itemChecklist)
    .where(eq(itemChecklist.idCheck, originalIdChecklist));

  if (originalItems.length > 0) {
    // 4. Create NEW Items linked to NEW checklist
    for (const item of originalItems) {
      const [newItem] = await tx
        .insert(itemChecklist)
        .values({
          idCheck: newChecklist.idChecklist,
          titulo: item.titulo,
          descripcion: item.descripcion,
        })
        .returning();

      // 5. Create 'estadoItemChecklist' entry for the new Trabajo + new Checklist + new Item
      await tx.insert(estadoItemChecklist).values({
        idTrabajo: newIdTrabajo,
        idChecklist: newChecklist.idChecklist,
        idItemChecklist: newItem.idItemCheck,
        estado: 'PENDIENTE',
      });
    }
  }

  return newChecklist.idChecklist;
};

const calculateNextDate = (
  currentDateStr: string,
  frecuencia: string
): string | null => {
  if (!frecuencia) return null;
  const currentLimit = parseISO(currentDateStr);
  let nextDate: Date;

  switch (frecuencia.toLowerCase()) {
    case 'diaria':
      nextDate = addDays(currentLimit, 1);
      break;
    case 'semanal':
      nextDate = addWeeks(currentLimit, 1);
      break;
    case 'quincenal':
      nextDate = addDays(currentLimit, 15);
      break;
    case 'mensual':
      nextDate = addMonths(currentLimit, 1);
      break;
    case 'trimestral':
      nextDate = addMonths(currentLimit, 3);
      break;
    case 'semestral':
      nextDate = addMonths(currentLimit, 6);
      break;
    case 'anual':
      nextDate = addYears(currentLimit, 1);
      break;
    default:
      console.warn(`Unknown frequency: ${frecuencia}`);
      return null;
  }
  return convertToStr(nextDate);
};

export const checkAndCreatePeriodicMaintenance = async () => {
  console.log('Running periodic maintenance check...');
  const todayStr = convertToStr(new Date());

  try {
    const maintenances = await db
      .select({ mantenimiento: mantenimiento, trabajo: trabajo })
      .from(mantenimiento)
      .innerJoin(trabajo, eq(mantenimiento.idTrabajo, trabajo.idTrabajo))
      .where(
        and(
          eq(mantenimiento.tipo, 'Periodico'),
          eq(mantenimiento.fechaProximaGeneracion, todayStr),
          eq(mantenimiento.siguienteCreado, false)
        )
      );

    console.log(
      `Found ${maintenances.length} periodic maintenances to process.`
    );

    for (const { mantenimiento: mant, trabajo: tr } of maintenances) {
      if (!mant.frecuencia) continue;

      // Base date for grandchild calculation is TODAY (the generation date of the child)
      const grandchildDateStr = calculateNextDate(todayStr, mant.frecuencia);
      if (!grandchildDateStr) continue;

      await db.transaction(async tx => {
        // 1. Create new Trabajo (Child)
        const [newTrabajo] = await tx
          .insert(trabajo)
          .values({
            idC: null, // Will update if we have a checklist
            idU: tr.idU,
            nombre: tr.nombre,
            fecha: todayStr, // Child Created Today
            est: 'No Empezado',
            tipo: 'Mantenimiento',
          })
          .returning();

        // 2. Handle Checklist Duplication
        let newChecklistId = null;
        if (tr.idC) {
          newChecklistId = await duplicateChecklist(
            tx,
            tr.idC,
            newTrabajo.idTrabajo
          );
          if (newChecklistId) {
            await tx
              .update(trabajo)
              .set({ idC: newChecklistId })
              .where(eq(trabajo.idTrabajo, newTrabajo.idTrabajo));
          }
        }

        // 3. Create new Mantenimiento (Child)
        await tx.insert(mantenimiento).values({
          idTrabajo: newTrabajo.idTrabajo,
          fechaLimite: todayStr, // Requirement: fechaLimite = HOY
          prioridad: mant.prioridad,
          resumen: mant.resumen,
          tipo: 'Periodico',
          frecuencia: mant.frecuencia,
          instancia: mant.instancia,
          condicion: mant.condicion,
          siguienteCreado: false, // Legacy flag
          fechaProximaGeneracion: grandchildDateStr, // Set to calculated Grandchild date
        });

        // 4. Copy Groups
        const existingGroups = await tx
          .select()
          .from(grupoXtrabajo)
          .where(eq(grupoXtrabajo.idT, tr.idTrabajo));
        if (existingGroups.length > 0) {
          await tx.insert(grupoXtrabajo).values(
            existingGroups.map(g => ({
              idG: g.idG,
              idT: newTrabajo.idTrabajo,
            }))
          );
        }

        // 5. Update Parent to mark as processed
        await tx
          .update(mantenimiento)
          .set({ siguienteCreado: true })
          .where(eq(mantenimiento.idTrabajo, tr.idTrabajo));

        console.log(
          `Created new maintenance (ID: ${newTrabajo.idTrabajo}) from ID ${tr.idTrabajo}`
        );
      });
    }
  } catch (error) {
    console.error('Error running periodic maintenance check:', error);
  }
};

export const checkAndCreatePeriodicInspection = async () => {
  console.log('Running periodic inspection check...');
  const todayStr = convertToStr(new Date());

  try {
    const inspections = await db
      .select({ inspeccion: inspeccion, trabajo: trabajo })
      .from(inspeccion)
      .innerJoin(trabajo, eq(inspeccion.idT, trabajo.idTrabajo))
      .where(
        and(
          eq(inspeccion.fechaProximaGeneracion, todayStr),
          eq(inspeccion.siguienteCreado, false)
        )
      );

    console.log(
      `Found ${inspections.length} candidate inspections to process.`
    );

    for (const { inspeccion: insp, trabajo: tr } of inspections) {
      if (!insp.frecuencia) continue;

      const grandchildDateStr = calculateNextDate(todayStr, insp.frecuencia);
      if (!grandchildDateStr) continue;

      await db.transaction(async tx => {
        // 1. Create New Trabajo (Child)
        const [newTrabajo] = await tx
          .insert(trabajo)
          .values({
            idC: null,
            idU: tr.idU,
            nombre: tr.nombre,
            fecha: todayStr, // Child Created Today
            est: 'No Empezado',
            tipo: 'Inspeccion',
          })
          .returning();

        // 2. Handle Checklist Duplication
        let newChecklistId = null;
        if (tr.idC) {
          newChecklistId = await duplicateChecklist(
            tx,
            tr.idC,
            newTrabajo.idTrabajo
          );
          if (newChecklistId) {
            await tx
              .update(trabajo)
              .set({ idC: newChecklistId })
              .where(eq(trabajo.idTrabajo, newTrabajo.idTrabajo));
          }
        }

        // 3. Create New Inspeccion
        await tx.insert(inspeccion).values({
          idT: newTrabajo.idTrabajo,
          observacion: insp.observacion,
          frecuencia: insp.frecuencia,
          siguienteCreado: false,
          fechaProximaGeneracion: grandchildDateStr, // Set to calculated Grandchild date
        });

        // 4. Copy Groups
        const existingGroups = await tx
          .select()
          .from(grupoXtrabajo)
          .where(eq(grupoXtrabajo.idT, tr.idTrabajo));
        if (existingGroups.length > 0) {
          await tx.insert(grupoXtrabajo).values(
            existingGroups.map(g => ({
              idG: g.idG,
              idT: newTrabajo.idTrabajo,
            }))
          );
        }

        // 5. Update Parent to mark as processed
        await tx
          .update(inspeccion)
          .set({ siguienteCreado: true })
          .where(eq(inspeccion.idT, tr.idTrabajo));

        console.log(
          `Created new inspection (ID: ${newTrabajo.idTrabajo}) from ID ${tr.idTrabajo}`
        );
      });
    }
  } catch (error) {
    console.error('Error running periodic inspection check:', error);
  }
};

export const initScheduledJobs = () => {
  // Run every day at 00:00 (Midnight)
  cron.schedule('0 0 * * *', async () => {
    await checkAndCreatePeriodicMaintenance();
    await checkAndCreatePeriodicInspection();
  });

  console.log('Cron jobs initialized.');
};
