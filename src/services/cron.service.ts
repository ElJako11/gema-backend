import cron from 'node-cron';
import { db } from '../config/db';
import { eq, and, lte } from 'drizzle-orm';
import { mantenimiento } from '../tables/mantenimiento';
import { inspeccion } from '../tables/inspeccion';
import { trabajo } from '../tables/trabajo';
import { grupoXtrabajo } from '../tables/grupoXtrabajo';
import { checklist } from '../tables/checklist';
import { itemChecklist } from '../tables/item-checklist';
import { estadoItemChecklist } from '../tables/estadoItemChecklist';
import { addDays, addWeeks, addMonths, addYears, parseISO } from 'date-fns';
import { convertToStr } from '../utils/dateHandler';
import { Tx } from '../types/transaction';

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
    // We need to map old Item IDs to new Item IDs if we want to preserve exact mapping,
    // but here we just need to create them and create the 'estado' entries.

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
          eq(mantenimiento.siguienteCreado, false),
          lte(mantenimiento.fechaLimite, todayStr)
        )
      );

    console.log(
      `Found ${maintenances.length} periodic maintenances to process.`
    );

    for (const { mantenimiento: mant, trabajo: tr } of maintenances) {
      if (!mant.frecuencia) continue;

      const nextDateStr = calculateNextDate(mant.fechaLimite, mant.frecuencia);
      if (!nextDateStr) continue;

      await db.transaction(async tx => {
        // 1. Create new Trabajo (Placeholder idC initially)
        const [newTrabajo] = await tx
          .insert(trabajo)
          .values({
            idC: null, // Will update if we have a checklist
            idU: tr.idU,
            nombre: tr.nombre,
            fecha: convertToStr(new Date()),
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

        // 3. Create new Mantenimiento
        await tx.insert(mantenimiento).values({
          idTrabajo: newTrabajo.idTrabajo,
          fechaLimite: nextDateStr,
          prioridad: mant.prioridad,
          resumen: mant.resumen,
          tipo: 'Periodico',
          frecuencia: mant.frecuencia,
          instancia: mant.instancia,
          condicion: mant.condicion,
          siguienteCreado: false,
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

        // 5. Mark original as processed
        await tx
          .update(mantenimiento)
          .set({ siguienteCreado: true })
          .where(eq(mantenimiento.idMantenimiento, mant.idMantenimiento));

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
          eq(inspeccion.siguienteCreado, false),
          // For inspections, we assume the 'fecha' (creation date) of the previous one works as the anchor.
          // If it's a periodic inspection created on Jan 1st with 'Mensual' frequency, next should be Feb 1st.
          // We check if Today >= Date + Frequency
          // Ideally we should calculate the 'Due Date' (which is effectively Fecha + Frequency) and compare with Today.
          // Since SQL filtering on calculated date + interval complexity varies, we'll do simple check in loop or roughly here.
          // But wait, if we are running this daily, we can effectively say: "Is (Fecha + Frequency) <= Today?"
          // Since we don't have a 'fechaLimite' column for Inspections, we rely on 'fecha'.
          lte(trabajo.fecha, todayStr) // Optimistic filter: grab everything past/today, then filter by frequency calculation
        )
      );

    console.log(
      `Found ${inspections.length} candidate inspections to check frequency.`
    );

    for (const { inspeccion: insp, trabajo: tr } of inspections) {
      if (!insp.frecuencia) continue;

      const nextDateStr = calculateNextDate(tr.fecha, insp.frecuencia);
      // If next estimated date is in future, skip. We only create if Due Date <= Today.
      if (!nextDateStr || nextDateStr > todayStr) continue;

      await db.transaction(async tx => {
        // 1. Create New Trabajo
        const [newTrabajo] = await tx
          .insert(trabajo)
          .values({
            idC: null,
            idU: tr.idU,
            nombre: tr.nombre,
            fecha: nextDateStr, // Set proper date for the next inspection
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

        // 5. Mark original as processed
        await tx
          .update(inspeccion)
          .set({ siguienteCreado: true })
          .where(eq(inspeccion.id, insp.id));

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
