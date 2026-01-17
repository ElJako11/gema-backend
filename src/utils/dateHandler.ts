import {
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  addWeeks,
  addMonths,
  addYears,
} from 'date-fns';

export const calculateNextGenerationDate = (
  startDate: string | Date,
  frecuencia: string
): Date | null => {
  const date = new Date(startDate);

  switch (frecuencia) {
    case 'Diaria':
      return addDays(date, 1);
    case 'Semanal':
      return addWeeks(date, 1);
    case 'Mensual':
      return addMonths(date, 1);
    case 'Trimestral':
      return addMonths(date, 3);
    case 'Anual':
      return addYears(date, 1);
    default:
      return null;
  }
};

const isMonday = (date: Date): boolean => {
  return date.getDay() === 1;
};

const startofWeek = (date: Date): Date => {
  return startOfWeek(date);
};

export const getStartOfWeek = (date: string): Date => {
  const formattedDate = new Date(
    date.includes('T') ? date : `${date}T00:00:00`
  );

  const initialDate: Date = isMonday(formattedDate)
    ? formattedDate
    : startofWeek(formattedDate);

  return initialDate;
};

export const getEndOfWeek = (datestr: string) => {
  const date = new Date(
    datestr.includes('T') ? datestr : `${datestr}T00:00:00`
  );

  return endOfWeek(date, { weekStartsOn: 1 });
};

export const getStartofMonth = (datestr: string) => {
  const date = new Date(
    datestr.includes('T') ? datestr : `${datestr}T00:00:00`
  );

  return startOfMonth(date);
};

export const getEndofMonth = (datestr: string) => {
  const date = new Date(
    datestr.includes('T') ? datestr : `${datestr}T00:00:00`
  );

  return endOfMonth(date);
};

export const convertToStr = (date: Date) => {
  return date.toLocaleDateString('sv-SE', {
    timeZone: 'America/Caracas',
  });
};

export const convertUtcToStr = (date: Date) => {
  return date.toLocaleDateString('sv-SE', {
    timeZone: 'UTC',
  });
};
