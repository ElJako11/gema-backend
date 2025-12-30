import { startOfWeek, addDays, startOfMonth, endOfMonth } from 'date-fns';

const isMonday = (date: Date): boolean => {
  return date.getDay() === 1;
};

const startofWeek = (date: Date): Date => {
  return startOfWeek(date, { weekStartsOn: 1 });
};

export const getStartOfWeek = (date: string): Date => {
  const formattedDate = new Date(date);

  const initialDate: Date = isMonday(formattedDate)
    ? formattedDate
    : startofWeek(formattedDate);

  return initialDate;
};

export const Add = (date: Date) => {
  return addDays(date, 4);
};

export const getStartofMonth = (datestr: string) => {
  const date = new Date(datestr);

  return startOfMonth(date);
};

export const getEndofMonth = (datestr: string) => {
  const date = new Date(datestr);

  return endOfMonth(date);
};

export const convertToStr = (date: Date) => {
  return date.toLocaleDateString('sv-SE', {
    timeZone: 'America/Caracas'
  });
};
