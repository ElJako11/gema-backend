import { Request, Response } from 'express';
import { insertItem, updateItem, deleteItem, getAllItems } from "../../services/checklistItems/checklistItem.service";

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
  const { idChecklist, idItem } = req.params;
  const { body } = req;

  try {
    const updatedItem = await updateItem(
      Number(idChecklist),
      Number(idItem),
      body
    );

    res.status(200).json({ data: updatedItem });
    return;
  } catch (error) {
    if(error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }

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

  const { idChecklist, idItem } = req.params;

  try {
    const deletedItem = await deleteItem(Number(idChecklist), Number(idItem));

    res.status(200).json({ data: deletedItem });
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};
