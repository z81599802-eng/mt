import type { Response } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../middlewares/auth.js';
import { prisma } from '../prisma/client.js';
import { logger } from '../utils/logger.js';
import { getSocket } from '../utils/socket.js';

const orderItemSchema = z.object({ productId: z.string().uuid(), quantity: z.number().int().positive() });
const orderSchema = z.object({ paymentMode: z.enum(['CASH', 'UPI']), items: z.array(orderItemSchema).min(1) });
type OrderParams = { orderId: string };

export async function listOrders(req: AuthenticatedRequest, res: Response) {
  const where = req.user?.role === 'CUSTOMER' ? { userId: req.user.id } : undefined;
  const orders = await prisma.order.findMany({ where, include: { orderItems: true, user: true } });
  return res.json(orders);
}

export async function createOrder(req: AuthenticatedRequest, res: Response) {
  const { paymentMode, items } = orderSchema.parse(req.body);
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  if (products.length !== items.length) {
    return res.status(400).json({ message: 'Invalid product selection' });
  }
  const orderItemsData = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return {
      productId: product.id,
      quantity: item.quantity,
      unitPricePaisa: product.priceInPaisa,
      subtotalPaisa: product.priceInPaisa * item.quantity,
    };
  });
  const totalAmountPaisa = orderItemsData.reduce((sum, item) => sum + item.subtotalPaisa, 0);
  const orderRef = `MT-${Date.now().toString(36)}`;
  const order = await prisma.order.create({
    data: {
      userId: req.user!.id,
      orderRef,
      totalAmountPaisa,
      paymentMode,
      orderItems: { create: orderItemsData },
    },
    include: { orderItems: true },
  });
  logger.info('Order created', { orderId: order.id, orderRef });
  getSocket()?.emit('order:new', { orderId: order.id, orderRef });
  return res.status(201).json(order);
}

const paymentSchema = z.object({ paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED']) });

export async function updatePaymentStatus(req: AuthenticatedRequest<OrderParams>, res: Response) {
  const data = paymentSchema.parse(req.body);
  const order = await prisma.order.update({ where: { id: req.params.orderId }, data });
  getSocket()?.emit('order:payment', { orderId: order.id, paymentStatus: order.paymentStatus });
  return res.json(order);
}
