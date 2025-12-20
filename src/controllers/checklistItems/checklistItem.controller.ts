import { Request, Response } from 'express';
import {
  deleteItem,
  getAllItems,
  getItemsChecklist,
  insertItem,
  updateItem,
} from '../../services/checklistItems/checklistItem.service';

export const getAllItemsHandler = async (_req: Request, res: Response) => {
  try {
    const items = await getAllItems();

    res.status(200).json({ data: items });
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};

export const getItemsChecklistHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  try {
    const items = await getItemsChecklist(id);

    if (items.length === 0) {
      res.status(200).json([]);
      return;
    }

    res.status(200).json(items);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }
};

export const postItemHandler = async (req: Request, res: Response) => {
  if (!req.body) {
    res
      .status(400)
      .json({ message: 'No se recibieron los datos de la peticion' });
    return;
  }

  try {
    const insertedItem = await insertItem(req.body);
    res.status(201).json({ data: insertedItem });
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};

export const patchItemHandler = async (req: Request, res: Response) => {
  if (!req.body) {
    res
      .status(400)
      .json({ message: 'No se recibieron los datos de la peticion' });
    return;
  }

  try {
    const updatedItem = await updateItem(req.body);

    res.status(200).json({ data: updatedItem });
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};

export const deleteItemHandler = async (req: Request, res: Response) => {
  if (!req.params) {
    res
      .status(400)
      .json({ message: 'No se recibieron los datos de la peticion' });
    return;
  }

  const id = parseInt(req.params.id, 10);

  try {
    const deletedItem = await deleteItem(id);

    res.status(200).json({ data: deletedItem });
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};
