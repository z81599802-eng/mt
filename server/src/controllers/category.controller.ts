import type { Response } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../middlewares/auth.js';
import { prisma } from '../prisma/client.js';

const categorySchema = z.object({ name: z.string().min(2), imageUrl: z.string().url().optional() });
type CategoryParams = { categoryId: string };

export async function listCategories(_req: AuthenticatedRequest, res: Response) {
  const categories = await prisma.category.findMany({ include: { products: true } });
  return res.json(categories);
}

export async function createCategory(req: AuthenticatedRequest, res: Response) {
  const data = categorySchema.parse(req.body);
  const category = await prisma.category.create({ data });
  return res.status(201).json(category);
}

export async function updateCategory(req: AuthenticatedRequest<CategoryParams>, res: Response) {
  const data = categorySchema.partial().parse(req.body);
  const category = await prisma.category.update({ where: { id: req.params.categoryId }, data });
  return res.json(category);
}

export async function deleteCategory(req: AuthenticatedRequest<CategoryParams>, res: Response) {
  await prisma.category.delete({ where: { id: req.params.categoryId } });
  return res.status(204).send();
}
