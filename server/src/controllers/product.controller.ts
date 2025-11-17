import type { Response } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../middlewares/auth.js';
import { prisma } from '../prisma/client.js';

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  priceInPaisa: z.number().int().positive(),
  unitType: z.string().min(1),
  imageUrl: z.string().url().optional(),
  categoryId: z.string().uuid(),
});
type ProductParams = { productId: string };

export async function listProducts(_req: AuthenticatedRequest, res: Response) {
  const products = await prisma.product.findMany({ include: { category: true } });
  return res.json(products);
}

export async function createProduct(req: AuthenticatedRequest, res: Response) {
  const data = productSchema.parse(req.body);
  const product = await prisma.product.create({ data });
  return res.status(201).json(product);
}

export async function updateProduct(req: AuthenticatedRequest<ProductParams>, res: Response) {
  const data = productSchema.partial().parse(req.body);
  const product = await prisma.product.update({ where: { id: req.params.productId }, data });
  return res.json(product);
}

export async function deleteProduct(req: AuthenticatedRequest<ProductParams>, res: Response) {
  await prisma.product.delete({ where: { id: req.params.productId } });
  return res.status(204).send();
}
