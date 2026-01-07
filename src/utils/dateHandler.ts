import {
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
} from 'date-fns';

const isMonday = (date: Date): boolean => {
  return date.getDay() === 1;
};

const startofWeek = (date: Date): Date => {
  return startOfWeek(date, { weekStartsOn: 1 });
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

  return endOfWeek(date);
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
