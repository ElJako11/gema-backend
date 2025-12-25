import { InferInsertModel } from 'drizzle-orm';
import { itemPlantilla } from '../tables/itemPlantilla';

export type CreateItemPlantillaParams = InferInsertModel<typeof itemPlantilla>;
export type UpdateItemPlantillaParams = Partial<Omit<InferInsertModel<typeof itemPlantilla>, 'idItemPlantilla' | 'idPlantilla'>>;
