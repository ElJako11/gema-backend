export type ChecklistItem = {
  idChecklist: number;
  titulo: string;
  descripcion: string;
};

export type InsertItem = {
  idChecklist: number;
  descripcion: string;
  titulo: string;
};

export type UpdateItem = Pick<ChecklistItem, 'idChecklist'> &
  Partial<Pick<ChecklistItem, 'descripcion' | 'titulo'>>;
